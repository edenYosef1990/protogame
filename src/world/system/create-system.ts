import { DependenciesList } from "../../dependencies-management/get-dependencies";

export function createSystem(system: (dependencies: DependenciesList) => void) {
  return (dependencies: DependenciesList) => system(dependencies);
}
