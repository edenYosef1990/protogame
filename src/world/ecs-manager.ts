import { fabric } from "fabric";
import { Entity, LifecycleStatus } from "./entity";
import { ComponentMethods, EntityQueryResultItem } from "./component";
import { graphicsDef, renderedUiProxyDef } from "../built-in-ecs-components";
import { GraphicsComponent } from "../entity-object-proxy";
import { EventContainer } from "./event";
import { EntityUiObjectProxy } from "../ui/types/entity-ui-object-proxy";
import { StateDefinition } from "./state";
import { UiBuildTreeNode, UiTreeNode } from "../ui/types/ui-tree-node";
import { ResourceMethods, ResourcesContainer } from "./resources";

const uniqueIdGenerator = {
  id: 0,
  getUniqueId() {
    this.id = this.id + 1;
    return this.id;
  },
};

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

  deleteState(stateIdentifier: number) {
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
      if (comp.getIdentifier() === graphicsDef.getIdentifier()) {
        this.addToCanvas((entityInit[key] as GraphicsComponent).getGraphics());
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

    let renderedComponent = entity.components[graphicsDef.getIdentifier()];
    let renderedUiComponent =
      entity.components[renderedUiProxyDef.getIdentifier()];
    if (renderedComponent !== undefined) {
      this.removeFromCanvas(
        (renderedComponent as GraphicsComponent).getGraphics()
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
    if (componentDefintion.getIdentifier() === graphicsDef.getIdentifier()) {
      this.addToCanvas((component as GraphicsComponent).getGraphics());
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
    if (componentDefintion.getIdentifier() === graphicsDef.getIdentifier()) {
      this.addToCanvas((component as GraphicsComponent).getGraphics());
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
