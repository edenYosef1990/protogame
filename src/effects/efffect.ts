export interface IEffect {
  update(): void;
  renderedObject: fabric.Object;
  isDone: boolean;
}
