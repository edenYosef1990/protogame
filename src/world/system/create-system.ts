import { DependenciesList } from 'src/app/dependencies-management/get-dependencies';
import { EcsManager } from '../ecs-manager';

export function createSystem<QueryResult>(
  queryFromWorld: (worldManager: EcsManager) => QueryResult,
  system: (dependencies: DependenciesList, queryResults: QueryResult) => void
) {
  return (dependencies: DependenciesList) =>
    system(dependencies, queryFromWorld(dependencies.worldsManager));
}
