import {
  EffectSequenceProccess,
  ShotTrailEffectCommand,
  generateBigExplostionEffectCommand,
} from "./effect-sequence";
import { EffectsManager } from "./effects-manager";

export class EffectsSequencesManager {
  private ongoingProcess: EffectSequenceProccess[] = [];
  private effectsManager: EffectsManager;

  constructor(canvas: fabric.StaticCanvas) {
    this.effectsManager = new EffectsManager(
      (objet) => canvas.add(objet),
      (object) => canvas.remove(object)
    );
  }

  public addSequence(sequence: EffectSequenceProccess) {
    this.ongoingProcess.push(sequence);
  }

  public addExplosionEffectSequence(position: { x: number; y: number }) {
    this.addSequence(generateBigExplostionEffectCommand(position));
  }

  public addShotTrainEffectSequence(
    start: { x: number; y: number },
    end: { x: number; y: number },
    timeIntervalBetweenEffects: number
  ) {
    this.addSequence(
      new ShotTrailEffectCommand(start, end, timeIntervalBetweenEffects)
    );
  }

  iterate() {
    let toDelete = [];
    for (let i = 0; i < this.ongoingProcess.length; i++) {
      if (this.ongoingProcess[i].isDone()) {
        toDelete.push(i);
        continue;
      }
      const effects = this.ongoingProcess[i].executeAndTryGetEffects();
      if (!effects) continue;
      for (const effect of effects) {
        this.effectsManager.addEffect(effect);
      }
    }
    toDelete.reverse();
    toDelete.forEach((index) => this.ongoingProcess.splice(index, 1));
    this.effectsManager.iterate();
  }
}
