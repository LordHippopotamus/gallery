import { Engine, Scene } from "@babylonjs/core";

export class App {
  engine: Engine;
  scene: Scene;

  constructor(engine: Engine, defaultScene: Scene) {
    this.engine = engine;
    this.scene = defaultScene;
    this.render();
  }

  switchScene(scene: Scene) {
    this.scene.dispose();
    this.scene = scene;
    this.render();
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
