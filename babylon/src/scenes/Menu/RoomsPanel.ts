import { GUI3DManager, HolographicButton, StackPanel3D } from "@babylonjs/gui";
import { Menu } from ".";
import { MainPanel } from "./MainPanel";

export class RoomsPanel extends GUI3DManager {
  constructor(scene: Menu) {
    super(scene);

    const panel = new StackPanel3D();
    panel.margin = 0.2;

    this.addControl(panel);

    const buttonBack = new HolographicButton("ButtonBack");
    buttonBack.text = "Back";
    buttonBack.onPointerClickObservable.add(() => scene.switchPanel(MainPanel));
    panel.addControl(buttonBack);
  }
}
