import {
  Camera,
  Engine,
  FlyCamera,
  PointLight,
  Scene,
  SceneOptions,
  Vector3,
} from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import { EdgeDetectionPostProcess } from "@babylonjs/post-processes";
import { app } from "../main";

export class Base extends Scene {
  camera: Camera;

  constructor(options?: SceneOptions) {
    super(app.engine, options);

    if (import.meta.env.DEV) Inspector.Show(this, {});

    this.camera = this.setupCamera();
    this.setupLight();
    this.setupPostprocess();
  }

  setupCamera(): Camera {
    const camera = new FlyCamera("FlyCamera", new Vector3(0, 1.8, 0), this);
    camera.rollCorrect = 5;
    camera.speed = 0.1;
    camera._checkInputs = function () {
      FlyCamera.prototype._checkInputs.call(this);
      this.position.y = 1.8;
    };
    camera.attachControl();
    return camera;
  }

  setupLight() {
    new PointLight("light", new Vector3(0, 3, 0), this);
  }

  setupPostprocess() {
    new EdgeDetectionPostProcess("edgeDetection", this, 1, this.camera);
  }
}
