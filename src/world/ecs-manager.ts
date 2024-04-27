import { fabric } from "fabric";
import { Entity, LifecycleStatus } from "./entity";
import { ComponentMethods, EntityQueryResultItem } from "./component";
import {
  Transform,
  renderedProxyDef,
  renderedUiProxyDef,
} from "../built-in-ecs-components";
import { EntityObjectProxy } from "../entity-object-proxy";
import { EventContainer } from "./event";
import { EntityUiObjectProxy } from "../ui/types/entity-ui-object-proxy";
import { StateDefinition } from "./state";
import {
  UiBuildTreeNode,
  UiNodeType,
  UiTreeNode,
} from "../ui/types/ui-tree-node";
import { ResourceMethods, ResourcesContainer } from "./resources";

const uniqueIdGenerator = {
  id: 0,
  getUniqueId() {
    this.id = this.id + 1;
    return this.id;
  },
};

export interface ITransformMappingManager {
  removeNode(father: number): void;
  addNode(nodeId: string, transform: Transform): void;
  isChildOfSomeone(id: number): boolean;
  upsertRelativeTransform(id: number, newTransform: Transform): void;
  clearChanges(): void;
  getChanges(): { id: number; newTransform: Transform }[];
}

export class TransformersManager implements ITransformMappingManager {
  fatherChildrenMapping: Map<number, number[]> = new Map();
  childrenFatherMapping: Map<number, number> = new Map();
  idTransformMapping: Map<number, Transform> = new Map();
  idAbosulteTransformMapping: Map<number, Transform> = new Map();
  idAbosulteTransformMappingChanged: Map<number, Transform> = new Map();

  addNode(nodeId: string, transform: Transform, father?: number): void {
    // const nodeTransform = this.idAbosulteTransformMapping.get(father) ?? {
    //   top: 0,
    //   left: 0,
    // };
    this.idAbosulteTransformMapping;
  }

  removeNode(nodeId: number): void {
    const children = this.fatherChildrenMapping.get(nodeId) ?? [];
    this.fatherChildrenMapping.delete(nodeId);
    this.childrenFatherMapping.delete(nodeId);
    for (let child of children) {
      this.removeNode(child);
    }
  }

  getChanges(): { id: number; newTransform: Transform }[] {
    return [...this.idAbosulteTransformMappingChanged.keys()].map((x) => {
      const value = this.idAbosulteTransformMappingChanged.get(x)!;
      return { id: x, newTransform: value };
    });
  }

  isChildOfSomeone(id: number): boolean {
    return this.childrenFatherMapping.get(id) !== undefined;
  }

  private spreadChangeInSubtree(id: number) {
    const nodeTransform = this.idAbosulteTransformMapping.get(id) ?? {
      top: 0,
      left: 0,
    };
    const children = this.fatherChildrenMapping.get(id) ?? [];
    for (const child of children) {
      const childTransform = this.idTransformMapping.get(child)!;
      const abosulteTransform: Transform = {
        top: nodeTransform.top + childTransform.top,
        left: nodeTransform.left + childTransform.left,
      };
      this.idAbosulteTransformMapping.set(child, abosulteTransform);
      this.idAbosulteTransformMappingChanged.set(child, abosulteTransform);
      this.spreadChangeInSubtree(child);
    }
  }

  clearChanges() {
    this.idAbosulteTransformMappingChanged.clear();
  }

  upsertRelativeTransform(id: number, newTransform: Transform) {
    this.idTransformMapping.set(id, newTransform);
    const father = this.childrenFatherMapping.get(id);
    if (father) {
      this.spreadChangeInSubtree(father);
    } else {
      this.spreadChangeInSubtree(id);
    }
  }
}

export interface StateDetail {
  currentState: number;
  formerState?: number;
  wasJustCreated: boolean;
}

export class EcsManager {
  resourcesCointainer: ResourcesContainer = new ResourcesContainer();
  eventsContainer: EventContainer = new EventContainer();
  statesContainer: Map<number, StateDetail> = new Map();
  entities: Entity[] = [];
  lifecycleStatusMap: Map<string, LifecycleStatus> = new Map();

  constructor(
    private canvas: fabric.StaticCanvas,
    private uiCanvas: fabric.Canvas
  ) {}

  addToCanvas(entity: fabric.Object) {
    this.canvas.add(entity);
  }

  addToUiCanvas(entities: fabric.Object[]) {
    entities.forEach((entity) => this.uiCanvas.add(entity));
  }

  removeFromCanvas(entity: fabric.Object) {
    this.canvas.remove(entity);
  }

  removeFromUiCanvas(entities: fabric.Object[]) {
    entities.forEach((entity) => this.uiCanvas.remove(entity));
  }

  wasStateJustCreated(stateIdentifier: number): boolean {
    return this.statesContainer.get(stateIdentifier)?.wasJustCreated ?? false;
  }

  getState(stateIdentifier: number) {
    return this.statesContainer.get(stateIdentifier)?.currentState;
  }

  getResource<T>(resourceIdentifier: ResourceMethods<T>) {
    return this.resourcesCointainer.getResourceFromContainer(
      resourceIdentifier
    );
  }

  removedResource<T>(resourceIdentifier: ResourceMethods<T>) {
    return this.resourcesCointainer.removeResource(resourceIdentifier);
  }

  addResource<T>(resource: T, resourceIdentifier: ResourceMethods<T>) {
    return this.resourcesCointainer.addResource(resource, resourceIdentifier);
  }

  getFormerState(stateIdentifier: number) {
    return this.statesContainer.get(stateIdentifier)?.formerState;
  }

  setState<T extends number>(stateDefintion: StateDefinition<T>, value: T) {
    let currStateDetail = this.statesContainer.get(
      stateDefintion.getIdentifier()
    );
    if (!currStateDetail) {
      return this.statesContainer.set(stateDefintion.getIdentifier(), {
        currentState: value,
        formerState: undefined,
        wasJustCreated: true,
      });
    } else if (currStateDetail.currentState === value) {
      return;
    } else {
      return this.statesContainer.set(stateDefintion.getIdentifier(), {
        wasJustCreated: false,
        currentState: value,
        formerState: currStateDetail.formerState,
      });
    }
  }

  deleteState<T>(stateIdentifier: number) {
    return this.statesContainer.delete(stateIdentifier);
  }

  query(): Entity[] {
    return this.entities;
  }

  addEntity(entity: Entity) {
    this.entities.push({
      ...entity,
    });
  }

  replaceUiElement(
    entityId: number,
    elementTargetId: string,
    replaceWith: UiBuildTreeNode
  ) {
    let entityIndex = this.entities.findIndex((x) => x.id === entityId);
    let entity = this.entities[entityIndex];

    let renderedUiComponent =
      entity.components[renderedUiProxyDef.getIdentifier()];
    if (renderedUiComponent !== undefined) {
      let ui = renderedUiComponent as EntityUiObjectProxy;
      let { toAdd, toRemove } = ui.replaceElementInUi(
        elementTargetId,
        replaceWith
      );
      this.removeFromUiCanvas(toRemove);
      this.addToUiCanvas(toAdd);
    }
  }

  changeTextUiElement(
    entityId: number,
    elementTargetId: string,
    replaceWithText: string
  ) {
    let entityIndex = this.entities.findIndex((x) => x.id === entityId);
    let entity = this.entities[entityIndex];

    let renderedUiComponent =
      entity.components[renderedUiProxyDef.getIdentifier()];
    if (renderedUiComponent !== undefined) {
      let ui = renderedUiComponent as EntityUiObjectProxy;
      ui.changeTextValueInUi(elementTargetId, replaceWithText);
    }
  }

  getUiElement(entityId: number, elementTargetId: string): UiTreeNode | null {
    let entityIndex = this.entities.findIndex((x) => x.id === entityId);
    let entity = this.entities[entityIndex];

    let renderedUiComponent =
      entity.components[renderedUiProxyDef.getIdentifier()];
    if (renderedUiComponent !== undefined) {
      let ui = renderedUiComponent as EntityUiObjectProxy;
      return ui.findElementInNode(elementTargetId);
    }
    return null;
  }

  initEntity<T extends Record<string, ComponentMethods<any>>>(
    entityInitDefinitions: T,
    entityInit: EntityQueryResultItem<T>
  ): number {
    let entity: Entity = {
      id: uniqueIdGenerator.getUniqueId(),
      components: {},
    };
    for (const key in entityInitDefinitions) {
      const comp = entityInitDefinitions[key];
      if (comp.getIdentifier() === renderedProxyDef.getIdentifier()) {
        this.addToCanvas(
          (entityInit[key] as EntityObjectProxy).getRenderedObject()
        );
      }
      if (comp.getIdentifier() === renderedUiProxyDef.getIdentifier()) {
        this.addToUiCanvas(
          (entityInit[key] as EntityUiObjectProxy).getRenderedObject()
        );
      }
      comp.addComponentToEntity(entity, entityInit[key]);
      this.setLifecycleState(
        { entityId: entity.id, componentId: comp.getIdentifier() },
        "created"
      );
    }
    this.addEntity(entity);
    return entity.id;
  }

  removeEntity(entityId: number) {
    let entityIndex = this.entities.findIndex((x) => x.id === entityId);
    let entity = this.entities[entityIndex];

    let renderedComponent = entity.components[renderedProxyDef.getIdentifier()];
    let renderedUiComponent =
      entity.components[renderedUiProxyDef.getIdentifier()];
    if (renderedComponent !== undefined) {
      this.removeFromCanvas(
        (renderedComponent as EntityObjectProxy).getRenderedObject()
      );
    }
    if (renderedUiComponent !== undefined) {
      this.removeFromUiCanvas(
        (renderedUiComponent as EntityUiObjectProxy).getRenderedObject()
      );
    }
    this.entities.splice(entityIndex, 1);
  }

  addComponent<T>(
    entityId: number,
    component: T,
    componentDefintion: ComponentMethods<T>
  ) {
    let entity = this.entities[entityId];
    entity.components[componentDefintion.getIdentifier()] = component;
    this.setLifecycleState(
      { entityId, componentId: componentDefintion.getIdentifier() },
      "created"
    );
    if (
      componentDefintion.getIdentifier() === renderedProxyDef.getIdentifier()
    ) {
      this.addToCanvas((component as EntityObjectProxy).getRenderedObject());
    } else if (
      componentDefintion.getIdentifier() === renderedUiProxyDef.getIdentifier()
    ) {
      this.addToUiCanvas(
        (component as EntityUiObjectProxy).getRenderedObject()
      );
    }
  }

  removeComponent<T>(
    entityId: number,
    componentDefintion: ComponentMethods<T>
  ) {
    let entity = this.entities.find((x) => x.id === entityId);
    if (!entity) return;
    let component = entity.components[componentDefintion.getIdentifier()];
    if (
      componentDefintion.getIdentifier() === renderedProxyDef.getIdentifier()
    ) {
      this.addToCanvas((component as EntityObjectProxy).getRenderedObject());
    }
    delete entity.components[componentDefintion.getIdentifier()];
  }

  setLifecycleState(
    key: { entityId: number; componentId: string },
    value: LifecycleStatus
  ) {
    this.lifecycleStatusMap.set(JSON.stringify(key), value);
  }

  isInLifecycleStats(
    entityId: number,
    componentId: string,
    status: LifecycleStatus
  ) {
    return (
      this.lifecycleStatusMap.get(JSON.stringify({ entityId, componentId })) ===
      status
    );
  }

  clearPreviousStates() {
    this.statesContainer.forEach((detail) => {
      detail.formerState = undefined;
      detail.wasJustCreated = false;
    });
  }

  onEndLoop() {
    //handling life cycles tags
    this.eventsContainer.clearEvents();
    this.clearPreviousStates();
    this.lifecycleStatusMap.clear();
  }
}
