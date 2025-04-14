import { GUI3DManager, HolographicButton, StackPanel3D } from "@babylonjs/gui";
import { app } from "../../main";
import { Room } from "../Room";
import { Menu } from ".";
import { RoomsPanel } from "./RoomsPanel";

export class MainPanel extends GUI3DManager {
  constructor(scene: Menu) {
    super(scene);

    const panel = new StackPanel3D();
    panel.margin = 0.2;

    this.addControl(panel);

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
    buttonRooms.onPointerClickObservable.add(() =>
      scene.switchPanel(RoomsPanel)
    );
    panel.addControl(buttonRooms);
  }
}
