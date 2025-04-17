import {
  Camera,
  FlyCamera,
  PointLight,
  Scene,
  SceneOptions,
  Vector3,
} from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import { app } from "../main";

export class Base extends Scene {
  camera: Camera;
  isControlsAllowed?: boolean = true;

  constructor(isControlsAllowed?: boolean, options?: SceneOptions) {
    super(app.engine, options);

    if (import.meta.env.DEV) Inspector.Show(this, {});

    this.isControlsAllowed = isControlsAllowed;
    this.camera = this.setupCamera();
    this.setupLight();
  }

  setupCamera(): Camera {
    const camera = new FlyCamera("FlyCamera", new Vector3(0, 1.8, 0), this);
    camera.rollCorrect = 5;
    camera.speed = 0.2;
    camera.checkCollisions = true;
    camera.minZ = 0.01;
    camera._checkInputs = function () {
      FlyCamera.prototype._checkInputs.call(this);
      this.position.y = 1.8;
    };
    if (this.isControlsAllowed) {
      camera.attachControl();
    }
    const requestPointerLock = () => {
      if (this.isControlsAllowed) {
        app.canvas.requestPointerLock();
      }
    };
    app.canvas.addEventListener("click", requestPointerLock);
    this.onDispose = () =>
      app.canvas.removeEventListener("click", requestPointerLock);

    return camera;
  }

  allowControls() {
    this.isControlsAllowed = true;
    this.camera.attachControl();
  }

  disallowControls() {
    document.exitPointerLock();
    this.isControlsAllowed = false;
    this.camera.detachControl();
  }

  setupLight() {
    new PointLight("light", new Vector3(0, 3, 0), this);
  }
}
