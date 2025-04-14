import {
  Color3,
  MeshBuilder,
  PointerEventTypes,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { app } from "../../main";
import { Menu } from "../Menu";
import { getCenterRay, isObectsNear } from "../../utils";
import { WoodProceduralTexture } from "@babylonjs/procedural-textures";

export class Door {
  constructor(
    scene: Scene,
    width: number,
    height: number,
    depth: number,
    position: Vector3
  ) {
    const texture = new WoodProceduralTexture("wood", 1024, scene);

    const doorMaterial = new StandardMaterial("doorMaterial", scene);
    doorMaterial.diffuseTexture = texture;
    doorMaterial.specularPower = 0;

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

    scene.onPointerObservable.add((pointerInfo) => {
      if (
        pointerInfo.type !== PointerEventTypes.POINTERDOWN ||
        !isObectsNear(scene.cameras[0], door, 5)
      ) {
        return;
      }

      const ray = getCenterRay(scene, scene.cameras[0]);
      const hit = scene.pickWithRay(ray);

      if (hit?.pickedMesh === door) {
        app.switchScene(new Menu());
      }
    });

    scene.onBeforeRenderObservable.add(() => {
      const ray = getCenterRay(scene, scene.cameras[0]);
      const hit = scene.pickWithRay(ray);

      if (
        hit &&
        hit.pickedMesh === door &&
        isObectsNear(scene.cameras[0], door, 5)
      ) {
        doorMaterial.emissiveColor = new Color3(0.3, 0.3, 0.3);
      } else {
        doorMaterial.emissiveColor = new Color3(0, 0, 0);
      }
    });
  }
}
