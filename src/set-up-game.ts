import { GameLoopScheduler } from "./scheduler";
import { setUpCanvases } from "./set-up-canvases";
import { fabric } from "fabric";

export function createGame(): GameLoopScheduler {
  setUpCanvases("app");

  let gameCanvas = new fabric.StaticCanvas("myCanvas", {
    backgroundColor: "rgb(0,100,0)",
    containerClass: "custom-canvas-conatiner",
    interactive: false,
  });
  let uiCanvas = new fabric.Canvas("uiCanvas", {
    backgroundColor: "rgba(0,0,0,0)",
    containerClass: "custom-canvas-conatiner",
    interactive: false,
    defaultCursor: "default",
    hoverCursor: "default",
    moveCursor: "default",
  });
  return new GameLoopScheduler(gameCanvas, uiCanvas);
}
