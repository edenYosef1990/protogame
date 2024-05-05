import { DependenciesList } from "../../dependencies-management/get-dependencies";
import { ComponentMethods, QueryListResult } from "../component";
import { tryGetComponentsForEntitiesLists as queryEntitiesWithComponents } from "./utils";
import { EventMethods } from "../event";
import { StateDefinition } from "../state";

export function createSystemWithQueries<
  T extends Record<
    string,
    | Record<string, ComponentMethods<any>>
    | EventMethods<any>
    | StateDefinition<any>
  >
>(
  queriesList: T,
  system: (
    dependencies: DependenciesList,
    queryResults: QueryListResult<T>
  ) => void
) {
  return (dependencies: DependenciesList) =>
    system(
      dependencies,
      queryEntitiesWithComponents(dependencies.worldsManager, queriesList)
    );
}
