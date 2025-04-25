import { GUI3DManager, HolographicButton, CylinderPanel } from "@babylonjs/gui";
import { Menu } from ".";
import { MainPanel } from "./MainPanel";
import { Vector3 } from "@babylonjs/core";
import { app } from "../../main";
import { Room } from "../Room";

export class RoomsPanel extends GUI3DManager {
  panel: CylinderPanel;

  constructor(scene: Menu) {
    super(scene);

    const panel = new CylinderPanel();
    panel.position = new Vector3(0, 0, -3);
    panel.radius = 5;
    panel.margin = 0.2;
    panel.columns = 5;
    this.panel = panel;
    this.addControl(panel);

    const backButton = new HolographicButton("BackButton");
    backButton.text = "Back";
    backButton.onPointerUpObservable.add(() => {
      scene.switchPanel(MainPanel);
    });
    panel.addControl(backButton);

    this.drawButtons();
  }

  async drawButtons() {
    app.showLoader();
    const res = await fetch(app.baseUrl + "/users");
    const users: { name: string; id: string }[] = await res.json();

    users.forEach((user) => {
      const sceneButton = new HolographicButton(user.name);
      sceneButton.text = user.name;
      sceneButton.onPointerUpObservable.add(() => {
        app.switchScene(new Room(user.id));
      });
      this.panel.addControl(sceneButton);
    });
    app.hideLoader();
  }
}
