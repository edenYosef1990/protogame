const resourceUniqueIdGenerator = {
  id: 0,
  getUniqueId() {
    this.id = this.id + 1;
    return this.id;
  },
};

export class ResourcesContainer {
  IdResourcesMapping: Map<number, any> = new Map();
  addResource<T>(event: T, statesMethods: ResourceMethods<T>) {
    const resourceTypeIdentifier = statesMethods.resourceIdentifier();
    if (!this.IdResourcesMapping.has(resourceTypeIdentifier)) {
      this.IdResourcesMapping.set(resourceTypeIdentifier, {
        events: new Map(),
      });
    }
    this.IdResourcesMapping.get(resourceTypeIdentifier)?.events.set(resourceTypeIdentifier, event);
    return resourceTypeIdentifier;
  }
  removeResource(resourceDefintion: ResourceMethods<any>) {
    this.IdResourcesMapping.delete(resourceDefintion.resourceIdentifier());
  }
  getResourceFromContainer<T>(resourceDefintion: ResourceMethods<T>): T | undefined {
    return this.IdResourcesMapping.get(resourceDefintion.resourceIdentifier()) as T;
  }
}

export interface ResourceMethods<T> {
  type: 'resources';
  resourceIdentifier: () => number;
}

export function getResourceQueryBaseMethods<T>(): ResourceMethods<T> {
  const queueId = resourceUniqueIdGenerator.getUniqueId();
  return {
    type: 'resources',
    resourceIdentifier: () => {
      return queueId;
    },
  };
}
