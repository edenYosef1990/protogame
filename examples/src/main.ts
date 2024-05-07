import "./style.css";
import { createGame } from "../../src/set-up-game.ts";
import { gameModule } from "./01-move-character/index.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <div id="app"></div>
  </div>
`;

let scheduler = createGame();
scheduler.setModule(gameModule);
scheduler.startLoop();
