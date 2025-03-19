import { Engine } from "@babylonjs/core";
import { Hall } from "./scenes/Hall";
import { App } from "./App";

const canvas = document.querySelector("#app") as HTMLCanvasElement;
canvas.addEventListener("click", () => canvas.requestPointerLock());
const engine = new Engine(canvas);
export const app = new App(engine, new Hall(engine));
