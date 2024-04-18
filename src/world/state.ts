export interface StateDefinition<T extends number> {
  type: 'state';
  currentValue: T;
  getIdentifier: () => number;
}

const stateUniqueIdGenerator = {
  id: 0,
  getUniqueId() {
    this.id = this.id + 1;
    return this.id;
  },
};

export function createEventDefintion<T extends number>(
  initValue: T
): StateDefinition<T> {
  let id = stateUniqueIdGenerator.getUniqueId();
  return {
    type: 'state',
    currentValue: initValue,
    getIdentifier() {
      return id;
    },
  };
}
