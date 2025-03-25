import {
  Color3,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";

export class Walls {
  constructor(
    scene: Scene,
    roomSize: number,
    wallHeight: number,
    wallThickness: number
  ) {
    const material = new StandardMaterial("material", scene);
    material.diffuseColor = new Color3(0.2, 0.2, 0.4);
    material.specularPower = 0;

    const frontWall = MeshBuilder.CreateBox(
      "frontWall",
      {
        width: roomSize,
        height: wallHeight,
        depth: wallThickness,
      },
      scene
    );
    frontWall.position = new Vector3(0, wallHeight / 2, roomSize / 2);
    frontWall.material = material;
    frontWall.checkCollisions = true;

    const backWall = MeshBuilder.CreateBox(
      "backWall",
      {
        width: roomSize,
        height: wallHeight,
        depth: wallThickness,
      },
      scene
    );
    backWall.position = new Vector3(0, wallHeight / 2, -roomSize / 2);
    backWall.material = material;
    backWall.checkCollisions = true;

    const leftWall = MeshBuilder.CreateBox(
      "leftWall",
      {
        width: wallThickness,
        height: wallHeight,
        depth: roomSize,
      },
      scene
    );
    leftWall.position = new Vector3(-roomSize / 2, wallHeight / 2, 0);
    leftWall.material = material;
    leftWall.checkCollisions = true;

    const rightWall = MeshBuilder.CreateBox(
      "rightWall",
      {
        width: wallThickness,
        height: wallHeight,
        depth: roomSize,
      },
      scene
    );
    rightWall.position = new Vector3(roomSize / 2, wallHeight / 2, 0);
    rightWall.material = material;
    rightWall.checkCollisions = true;

    const floor = MeshBuilder.CreateBox(
      "floor",
      {
        width: roomSize,
        height: wallThickness,
        depth: roomSize,
      },
      scene
    );
    floor.position = Vector3.Zero();
    floor.material = material;

    const ceiling = MeshBuilder.CreateBox(
      "ceiling",
      {
        width: roomSize,
        height: wallThickness,
        depth: roomSize,
      },
      scene
    );
    ceiling.position = new Vector3(0, wallHeight, 0);
    ceiling.material = material;
  }
}
