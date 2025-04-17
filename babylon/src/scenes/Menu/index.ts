import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
import { GUI3DManager } from "@babylonjs/gui";
import { Base } from "..";
import { app } from "../../main";
import { MainPanel } from "./MainPanel";

export class Menu extends Base {
  panel: GUI3DManager;

  constructor() {
    super(false);
    this.panel = new MainPanel(this);
  }

  setupCamera() {
    const camera = new ArcRotateCamera(
      "ArcRotateCamera",
      -Math.PI / 2,
      Math.PI / 2,
      5,
      Vector3.Zero(),
      this
    );

    camera.lowerAlphaLimit = -(3 * Math.PI) / 4;
    camera.upperAlphaLimit = -Math.PI / 4;

    camera.lowerBetaLimit = Math.PI / 4;
    camera.upperBetaLimit = (Math.PI * 3) / 4;

    camera.attachControl(app.canvas, true);

    return camera;
  }

  public switchPanel(Panel: new (scene: Menu) => GUI3DManager) {
    this.panel.dispose();
    this.panel = new Panel(this);
  }
}
