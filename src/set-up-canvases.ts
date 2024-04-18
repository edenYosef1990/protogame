export function setUpCanvases(id: string) {
  const app = document.getElementById(id)!;
  console.log(app);
  app.style.position = "relative";

  const gameCanvas = document.createElement("canvas");
  gameCanvas.id = "myCanvas";
  gameCanvas.width = 1000;
  gameCanvas.height = 1000;
  gameCanvas.style.position = "absolute";
  gameCanvas.style.top = "0";
  gameCanvas.style.left = "0";
  gameCanvas.style.offset = "0";

  let gameCanvasContainer = document.createElement("div");
  gameCanvasContainer.style.position = "absolute";
  gameCanvasContainer.style.top = "0";
  gameCanvasContainer.style.left = "0";
  gameCanvasContainer.style.offset = "0";
  gameCanvasContainer.append(gameCanvas);

  const uiCanvas = document.createElement("canvas");
  uiCanvas.id = "uiCanvas";
  uiCanvas.width = 1000;
  uiCanvas.height = 1000;
  uiCanvas.style.position = "absolute";
  uiCanvas.style.top = "0";
  uiCanvas.style.left = "0";
  uiCanvas.style.offset = "0";

  let uiCanvasContainer = document.createElement("div");
  uiCanvasContainer.style.position = "absolute";
  uiCanvasContainer.style.top = "0";
  uiCanvasContainer.style.left = "0";
  uiCanvasContainer.style.offset = "0";
  uiCanvasContainer.append(uiCanvas);

  app.append(gameCanvasContainer);
  app.append(uiCanvasContainer);
}
