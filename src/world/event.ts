const eventsQueuesUniqueIdGenerator = {
  id: 0,
  getUniqueId() {
    this.id = this.id + 1;
    return this.id;
  },
};

const eventsUniqueIdGenerator = {
  id: 0,
  getUniqueId() {
    this.id = this.id + 1;
    return this.id;
  },
};

export interface EventQueue {
  events: Map<number, any>;
}

export class EventContainer {
  queues: Map<number, EventQueue> = new Map();
  addEvent<T>(event: T, eventMethods: EventMethods<T>) {
    const uniqueId = eventsUniqueIdGenerator.getUniqueId();
    if (!this.queues.has(eventMethods.getQueueIdentifier())) {
      this.queues.set(eventMethods.getQueueIdentifier(), { events: new Map() });
    }
    this.queues
      .get(eventMethods.getQueueIdentifier())
      ?.events.set(uniqueId, event);
    return uniqueId;
  }
  removeEvent(eventId: number, queueId: number) {
    this.queues.get(queueId)?.events.delete(eventId);
  }
  getEventsFromContainer(queueId: number): EventQueue | undefined {
    return this.queues.get(queueId);
  }
  clearEventsForQueue(queueId: number) {
    this.queues.get(queueId)?.events.clear();
  }

  clearEvents() {
    this.queues.clear();
  }
}

export interface EventMethods<T> {
  type: 'events';
  getEventsFromContainer: (eventConainer: EventContainer) => T[] | undefined;
  getQueueIdentifier: () => number;
}

export function GetEventsQueryBaseMethods<T>(): EventMethods<T> {
  const queueId = eventsQueuesUniqueIdGenerator.getUniqueId();
  return {
    type: 'events',
    getEventsFromContainer: (eventConainer: EventContainer) => {
      const queue = eventConainer.getEventsFromContainer(queueId);
      if (queue === undefined) return undefined;
      return Array.from(queue.events.values()) as T[];
    },
    getQueueIdentifier: () => {
      return queueId;
    },
  };
}
