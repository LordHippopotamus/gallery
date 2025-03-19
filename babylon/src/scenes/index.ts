import {
  Engine,
  FlyCamera,
  PointLight,
  Scene,
  SceneOptions,
  Vector3,
} from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import { EdgeDetectionPostProcess } from "@babylonjs/post-processes";

export class Base extends Scene {
  constructor(engine: Engine, options?: SceneOptions) {
    super(engine, options);

    if (import.meta.env.DEV) Inspector.Show(this, {});

    const camera = new FlyCamera("FlyCamera", new Vector3(0, 1.8, 0), this);
    camera.rollCorrect = 5;
    camera.speed = 0.1;
    camera._checkInputs = function () {
      FlyCamera.prototype._checkInputs.call(this);
      this.position.y = 1.8;
    };
    camera.attachControl();
    new PointLight("light", new Vector3(0, 3, 0), this);

    new EdgeDetectionPostProcess("edgeDetection", this, 1, camera);

    this.setupScene();
  }

  setupScene() {}
}
