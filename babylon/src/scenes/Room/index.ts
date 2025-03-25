import { HemisphericLight, Vector3 } from "@babylonjs/core";
import { Base } from "../";
import { app } from "../../main";
import { Walls } from "./Walls";
import { Door } from "./Door";

export class Room extends Base {
  constructor() {
    super();

    const requestPointerLock = () => app.canvas.requestPointerLock();
    app.canvas.addEventListener("click", requestPointerLock);
    this.onDispose = () =>
      app.canvas.removeEventListener("click", requestPointerLock);

    const roomSize = 10;
    const wallHeight = 3;
    const wallThickness = 0.2;

    new Walls(this, roomSize, wallHeight, wallThickness);
    new Door(this, 1, 2, wallThickness + 0.1, new Vector3(0, 1, -roomSize / 2));

    return this;
  }

  setupLight() {
    const light = new HemisphericLight("light", Vector3.Zero(), this);
    light.intensity = 0.6;
  }
}
