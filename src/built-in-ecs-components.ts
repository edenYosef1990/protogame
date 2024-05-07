import { GraphicsComponent } from "./entity-object-proxy";
import { EntityUiObjectProxy } from "./ui/types/entity-ui-object-proxy";
import { GetComponentQueryBaseMethods } from "./world/component";

export type labelType = {};
export interface Transform {
  top: number;
  left: number;
}

export const UnitLabel = GetComponentQueryBaseMethods<labelType>("unit");
export const enemyUnitLabel =
  GetComponentQueryBaseMethods<labelType>("enemy-u");
export const playerUnitLabel =
  GetComponentQueryBaseMethods<labelType>("player-u");
export const TransformDef =
  GetComponentQueryBaseMethods<Transform>("transform");

export const graphicsDef =
  GetComponentQueryBaseMethods<GraphicsComponent>("entityObjectProxy");

export const renderedUiProxyDef =
  GetComponentQueryBaseMethods<EntityUiObjectProxy>("uiEntityObjectProxy");
