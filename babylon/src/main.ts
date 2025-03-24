import { Engine } from "@babylonjs/core";
import { App } from "./App";
import { Menu } from "./scenes/Menu";
const canvas = document.querySelector("#app") as HTMLCanvasElement;
const engine = new Engine(canvas);
export const app = new App(canvas, engine);
app.initSession().then(() => app.switchScene(new Menu()));
