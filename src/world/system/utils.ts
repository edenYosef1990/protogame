import {
  ComponentMethods,
  QueryListResult,
  EntityQueryResultItem,
} from '../component';
import { Entity } from '../entity';
import { EcsManager } from '../ecs-manager';
import { EventMethods } from '../event';
import { StateDefinition } from '../state';
import { ResourceMethods } from '../resources';

export function tryGetComponentsFromEntity<
  T extends Record<string, ComponentMethods<any>>
>(
  worldManager: EcsManager,
  entity: Entity,
  query: T
): EntityQueryResultItem<T> | null {
  let result: Record<string, any> = {};
  for (const key in query) {
    const comp = query[key];
    if (!comp.IsComponentInEntity(entity)) return null;
    if (
      comp.filters.length > 0 &&
      !comp.filters.every((filter) =>
        filter(comp.getComponentFromEntity(entity))
      )
    ) {
      return null;
    }
    if (
      comp.lifecycleEvent !== undefined &&
      !worldManager.isInLifecycleStats(
        entity.id,
        comp.getIdentifier(),
        comp.lifecycleEvent
      )
    ) {
      return null;
    }
    result[key] = comp.getComponentFromEntity(entity);
  }
  result['id'] = entity.id;
  return result as EntityQueryResultItem<T>;
}

export function tryGetComponentsForEntitiesLists<
  T extends Record<
    string,
    | Record<string, ComponentMethods<any>>
    | EventMethods<any>
    | StateDefinition<any>
    | ResourceMethods<any>
  >
>(worldManager: EcsManager, queries: T): QueryListResult<T> {
  let resultsList: Record<string, any> = {};
  for (let queryKey in queries) {
    if (queries[queryKey].type === 'state') {
      let query = queries[queryKey] as StateDefinition<any>;
      resultsList[queryKey] = worldManager.getState(query.getIdentifier());
    } else if (queries[queryKey].type === 'resources') {
      let query = queries[queryKey] as ResourceMethods<any>;
      resultsList[queryKey] = worldManager.getState(query.resourceIdentifier());
    } else if (queries[queryKey].type !== 'events') {
      let query = queries[queryKey] as Record<string, ComponentMethods<any>>;
      resultsList[queryKey] = mapAndFilter(worldManager.query(), (entity) =>
        tryGetComponentsFromEntity(worldManager, entity, query)
      );
    } else {
      let query = queries[queryKey] as EventMethods<any>;
      resultsList[queryKey] =
        query.getEventsFromContainer(worldManager.eventsContainer) ?? [];
    }
  }
  return resultsList as QueryListResult<T>;
}

export function mapAndFilter<T, K>(collection: T[], mapFunc: (item: T) => K) {
  const accum = [];
  for (const item of collection) {
    const newItem = mapFunc(item);
    if (newItem !== null) accum.push(newItem);
  }
  return accum;
}
