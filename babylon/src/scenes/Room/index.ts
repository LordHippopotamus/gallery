import { HemisphericLight, Vector3 } from "@babylonjs/core";
import { Base } from "../";
import { app } from "../../main";
import { Walls } from "./Walls";
import { Door } from "./Door";
import { Picture } from "./Picture";

export class Room extends Base {
  userId: string;
  roomSize: number;
  wallHeight: number;
  wallThickness: number;
  pictures: Picture[];
  isPointerLockAllowed: boolean = true;

  constructor(userId: string) {
    super(true);

    this.userId = userId;
    this.roomSize = 10;
    this.wallHeight = 3;
    this.wallThickness = 0.2;
    this.pictures = [];

    new Walls(this, this.roomSize, this.wallHeight, this.wallThickness);
    new Door(
      this,
      1,
      2,
      this.wallThickness + 0.1,
      new Vector3(0, 1, -this.roomSize / 2)
    );

    this.drawPictures();

    return this;
  }

  async drawPictures() {
    app.showLoader();

    this.pictures.forEach((el) => el.dispose());
    const res = await fetch(app.baseUrl + "/storage/pictures/" + this.userId);
    const { images }: { images: { [k: string]: any }[] } = await res.json();

    const positions = [
      {
        place: 0,
        position: new Vector3(
          -((this.roomSize * 3) / this.roomSize),
          1.5,
          this.roomSize / 2
        ),
        rotation: new Vector3(0, 0, 0),
        path: null,
      },
      {
        place: 1,
        position: new Vector3(0, 1.5, this.roomSize / 2),
        rotation: new Vector3(0, 0, 0),
        path: null,
      },
      {
        place: 2,
        position: new Vector3(
          (this.roomSize * 3) / this.roomSize,
          1.5,
          this.roomSize / 2
        ),
        rotation: new Vector3(0, 0, 0),
        path: null,
      },
      {
        place: 3,
        position: new Vector3(
          this.roomSize / 2,
          1.5,
          -((this.roomSize * 3) / this.roomSize)
        ),
        rotation: new Vector3(0, Math.PI / 2, 0),
        path: null,
      },
      {
        place: 4,
        position: new Vector3(this.roomSize / 2, 1.5, 0),
        rotation: new Vector3(0, Math.PI / 2, 0),
        path: null,
      },
      {
        place: 5,
        position: new Vector3(
          this.roomSize / 2,
          1.5,
          (this.roomSize * 3) / this.roomSize
        ),
        rotation: new Vector3(0, Math.PI / 2, 0),
        path: null,
      },
      {
        place: 6,
        position: new Vector3(
          -this.roomSize / 2,
          1.5,
          -((this.roomSize * 3) / this.roomSize)
        ),
        rotation: new Vector3(0, -Math.PI / 2, 0),
        path: null,
      },
      {
        place: 7,
        position: new Vector3(-this.roomSize / 2, 1.5, 0),
        rotation: new Vector3(0, -Math.PI / 2, 0),
        path: null,
      },
      {
        place: 8,
        position: new Vector3(
          -this.roomSize / 2,
          1.5,
          (this.roomSize * 3) / this.roomSize
        ),
        rotation: new Vector3(0, -Math.PI / 2, 0),
        path: null,
      },
    ];

    const postitionsWithImages = positions.map((position) => {
      const fetchedPicture = images.find((el) => el.place === position.place);
      return {
        ...position,
        path: fetchedPicture ? fetchedPicture.path : null,
      };
    });

    this.pictures = postitionsWithImages.map(
      (el) =>
        new Picture(
          this,
          2,
          2,
          this.wallThickness + 0.1,
          el.position,
          el.rotation,
          el.place,
          el.path,
          this.userId === app.user?.id
        )
    );

    app.hideLoader();
  }

  setupLight() {
    const light = new HemisphericLight("light", Vector3.Zero(), this);
    light.intensity = 0.5;
  }
}
