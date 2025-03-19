import { MeshBuilder } from "@babylonjs/core";
import { Base } from "./";

export class Room extends Base {
  setupScene() {
    super.setupScene();

    MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, this);
  }
}
