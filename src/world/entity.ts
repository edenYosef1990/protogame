export type LifecycleStatus = 'created' | 'destroy';

export interface Entity {
  id: number;
  components: { [name: string]: any };
}
