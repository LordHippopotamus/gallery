import { Engine, Scene } from "@babylonjs/core";

export class App {
  canvas: HTMLCanvasElement;
  engine: Engine;
  scene: Scene | null;
  user: undefined | null | { id: string; name: string };
  baseUrl: string;

  constructor(canvas: HTMLCanvasElement, engine: Engine) {
    this.canvas = canvas;
    this.engine = engine;
    this.scene = null;
    this.user = undefined;
    this.baseUrl = import.meta.env.VITE_BASE_URL;
  }

  switchScene(scene: Scene) {
    if (this.scene) this.scene.dispose();
    this.scene = scene;
    this.engine.runRenderLoop(() => {
      scene.render();
    });
  }

  initSession = async () => {
    const res = await fetch(this.baseUrl + "/session", {
      credentials: "include",
    });
    if (res.ok) {
      const user = await res.json();
      this.user = user;
    } else {
      this.user = null;
    }
  };

  signin = () => {
    window.location.href = this.baseUrl + "/auth/github";
  };

  logout = () => {
    window.location.href = this.baseUrl + "/logout";
  };
}
