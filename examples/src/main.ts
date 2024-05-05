import "./style.css";
import { createGame } from "../../src/set-up-game.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <div id="app"></div>
  </div>
`;

createGame();
