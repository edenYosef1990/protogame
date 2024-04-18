import { DependenciesList } from 'src/app/dependencies-management/get-dependencies';
import { ComponentMethods, EntityQueryResultItem } from '../component';
import { mapAndFilter, tryGetComponentsFromEntity } from './utils';

export function createSystemWithQuery<
  T extends Record<string, ComponentMethods<any>>
>(
  query: T,
  system: (
    dependencies: DependenciesList,
    queryResults: EntityQueryResultItem<T>[]
  ) => void
) {
  return (dependencies: DependenciesList) =>
    system(
      dependencies,
      mapAndFilter(dependencies.worldsManager.query(), (entity) =>
        tryGetComponentsFromEntity(dependencies.worldsManager, entity, query)
      )
    );
}
