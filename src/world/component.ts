import { Entity, LifecycleStatus } from './entity';
import { EventMethods } from './event';
import { ResourceMethods } from './resources';
import { StateDefinition } from './state';

export interface ComponentMethods<T> {
  type: 'entities';
  addComponentToEntity: (entity: Entity, component: T) => void;
  IsComponentInEntity: (entity: Entity) => boolean;
  getComponentFromEntity: (entity: Entity) => T;
  getIdentifier: () => string;
  filters: ((component: T) => boolean)[];
  where: (filter: (component: T) => boolean) => ComponentMethods<T>;
  on: (event: LifecycleStatus) => ComponentMethods<T>;
  lifecycleEvent?: LifecycleStatus;
}

export function GetComponentQueryBaseMethods<T>(
  identifier: string
): ComponentMethods<T> {
  return {
    type: 'entities',
    addComponentToEntity: (entity: Entity, component: T) => {
      entity.components[identifier] = component;
    },
    IsComponentInEntity: (entity: Entity): boolean => {
      return entity.components[identifier] !== undefined;
    },
    getComponentFromEntity: (entity: Entity): T => {
      return entity.components[identifier] as T;
    },
    getIdentifier: (): string => {
      return identifier;
    },
    filters: [],
    where(filter: (component: T) => boolean) {
      return {
        ...this,
        filters: [...this.filters, filter],
      };
    },
    on(event: LifecycleStatus) {
      return {
        ...this,
        lifecycleEvent: event,
      };
    },
  };
}

export type EntityQueryResultItem<T = Record<string, ComponentMethods<any>>> = {
  [Property in keyof T]: T[Property] extends ComponentMethods<infer D>
    ? D
    : null;
} & { id?: number };

export type EventQueryResultItem<T = EventMethods<any>> =
  T extends EventMethods<infer K> ? K : null;

export type StateQueryResultItem<T = StateDefinition<any>> =
  T extends StateDefinition<infer K> ? K : null;

export type ResourceQueryResultItem<T = ResourceMethods<any>> =
  T extends ResourceMethods<infer K> ? K : null;

export type QueryListResult<
  T = Record<
    string,
    | Record<string, ComponentMethods<any>>
    | EventMethods<any>
    | StateDefinition<any>
    | ResourceMethods<any>
  >
> = {
  [Property in keyof T]: T[Property] extends Record<
    string,
    ComponentMethods<any>
  >
    ? EntityQueryResultItem<T[Property]>[]
    : T[Property] extends EventMethods<any>
    ? EventQueryResultItem<T[Property]>[]
    : T[Property] extends StateDefinition<any>
    ? StateQueryResultItem<T[Property]>
    : ResourceQueryResultItem;
};

type Type = {
  b: {
    a: ComponentMethods<{ stam: string }>;
    b: ComponentMethods<{ helloThere: number }>;
  };
  a: EventMethods<{ a: number; b: string }>;
};

type newType = QueryListResult<Type>;

// type TypeName<T> = T extends string
//     ? "string"
//     : T extends number
//     ? "number"
//     : T extends boolean
//     ? "boolean"
//     : T extends undefined
//     ? "undefined"
//     : "object"

// const exampleString: TypeName<"oscar"> = "string"
// const exampleNumber: TypeName<5> = "number"
// const exampleBoolean: TypeName<true> = "boolean"
// const exampleUndefined: TypeName<undefined> = "undefined"

// interface ExampleInterface {
//     name: string
//     age: number
// }

// const exampleObject: TypeName<ExampleInterface> = "object"
// In this example, TypeName is a conditional type that accepts T as a generic type. We check if T extends (or is a subtype of) any of the…
