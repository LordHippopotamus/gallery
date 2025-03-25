import {
  AbstractMesh,
  Camera,
  Color3,
  Matrix,
  MeshBuilder,
  Ray,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { app } from "../../main";
import { Menu } from "../Menu";

export class Door {
  constructor(
    scene: Scene,
    width: number,
    height: number,
    depth: number,
    position: Vector3
  ) {
    const doorMaterial = new StandardMaterial("doorMaterial", scene);
    doorMaterial.diffuseColor = new Color3(0.2, 0.4, 0.2);
    doorMaterial.specularPower = 0;

    const doorHoveredMaterial = new StandardMaterial(
      "doorHoveredMaterial",
      scene
    );
    doorHoveredMaterial.diffuseColor = new Color3(0.8, 0.4, 0.4);
    doorHoveredMaterial.specularPower = 0;
    const door = MeshBuilder.CreateBox(
      "door",
      {
        width,
        height,
        depth,
      },
      scene
    );

    door.checkCollisions = true;
    door.material = doorMaterial;
    door.position = position;

    scene.onPointerDown = () => {
      const ray = getCenterRay(scene, scene.cameras[0]);
      const hit = scene.pickWithRay(ray);

      if (
        hit?.pickedMesh?.name === "door" &&
        isCameraNearButton(scene.cameras[0], door, 5)
      ) {
        app.switchScene(new Menu());
      }
    };

    scene.onBeforeRenderObservable.add(() => {
      const ray = getCenterRay(scene, scene.cameras[0]);
      const hit = scene.pickWithRay(ray);

      if (
        hit &&
        hit.pickedMesh === door &&
        isCameraNearButton(scene.cameras[0], door, 5)
      ) {
        door.material = doorHoveredMaterial;
      } else {
        door.material = doorMaterial;
      }
    });
  }
}

function getCenterRay(scene: Scene, camera: Camera): Ray {
  return scene.createPickingRay(
    scene.getEngine().getRenderWidth() / 2,
    scene.getEngine().getRenderHeight() / 2,
    Matrix.Identity(),
    camera
  );
}

function isCameraNearButton(
  camera: Camera,
  button: AbstractMesh,
  maxDistance: number
): boolean {
  return (
    Vector3.Distance(camera.position, button.absolutePosition) <= maxDistance
  );
}
