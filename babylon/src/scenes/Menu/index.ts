import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
import {
  Container3D,
  GUI3DManager,
  HolographicButton,
  StackPanel3D,
} from "@babylonjs/gui";
import { Base } from "..";
import { app } from "../../main";
import { Room } from "../Room";

export class Menu extends Base {
  manager: GUI3DManager;
  panel?: Container3D;

  constructor() {
    super();
    this.manager = new GUI3DManager(this);
    this.createMainPanel();
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

  initPanel(panel: Container3D) {
    if (this.panel) {
      this.manager.removeControl(this.panel);
    }

    this.manager.addControl(panel);
    this.panel = panel;
  }

  createMainPanel() {
    const panel = new StackPanel3D();
    panel.margin = 0.2;

    this.initPanel(panel);

    if (app.user) {
      const buttonMyRoom = new HolographicButton("ButtonMyRoom");
      buttonMyRoom.text = "My Room";
      buttonMyRoom.onPointerClickObservable.add(() =>
        app.switchScene(new Room())
      );
      panel.addControl(buttonMyRoom);

      const buttonLogout = new HolographicButton("ButtonLogout");
      buttonLogout.text = "Logout";
      buttonLogout.onPointerClickObservable.add(app.logout);
      panel.addControl(buttonLogout);
    } else {
      const buttonGithub = new HolographicButton("ButtonGithub");
      buttonGithub.text = "Sign In With GitHub";
      buttonGithub.onPointerClickObservable.add(app.signin);
      panel.addControl(buttonGithub);
    }

    const buttonRooms = new HolographicButton("buttonRooms");
    buttonRooms.text = "User Rooms";
    buttonRooms.onPointerClickObservable.add(() => this.createRoomsPanel());
    panel.addControl(buttonRooms);
  }

  createRoomsPanel() {
    const panel = new StackPanel3D();
    panel.margin = 0.2;

    this.initPanel(panel);

    const buttonBack = new HolographicButton("ButtonBack");
    buttonBack.text = "Back";
    buttonBack.onPointerClickObservable.add(() => this.createMainPanel());
    panel.addControl(buttonBack);
  }
}
