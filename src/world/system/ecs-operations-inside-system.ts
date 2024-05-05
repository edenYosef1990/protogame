import { ComponentMethods, EntityQueryResultItem } from '../component';
import { EcsManager } from '../ecs-manager';
import { Entity } from '../entity';

export function InitEntity<T extends Record<string, ComponentMethods<any>>>(
  worldManager: EcsManager,
  entityInitDefinitions: T,
  entityInit: EntityQueryResultItem<T>
) {
  let entity: Entity = { id: 1, components: {} };
  for (const key in entityInitDefinitions) {
    const comp = entityInitDefinitions[key];
    comp.addComponentToEntity(entity, entityInit[key]);
  }
  worldManager.addEntity(entity);
}

export function AddComponent<T>(
  worldManager: EcsManager,
  entityId: number,
  component: T,
  componentDefintion: ComponentMethods<T>
) {
  let entity = worldManager.entities[entityId];
  entity.components[componentDefintion.getIdentifier()] = component;
}

export function RemoveComponent<T>(
  worldManager: EcsManager,
  entityId: number,
  componentDefintion: ComponentMethods<T>
) {
  let entity = worldManager.entities[entityId];
  delete entity.components[componentDefintion.getIdentifier()];
}
