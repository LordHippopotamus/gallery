import {
  Color3,
  Mesh,
  MeshBuilder,
  PointerEventTypes,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { getCenterRay, isObectsNear } from "../../utils";
import { app } from "../../main";
import { Room } from ".";

export class Picture {
  private _mesh: Mesh;
  constructor(
    scene: Room,
    width: number,
    height: number,
    depth: number,
    position: Vector3,
    rotation: Vector3,
    place: number,
    path: string | null
  ) {
    if (!path) {
      const emptyPictureMaterial = new StandardMaterial(
        "emptyPictureMaterial",
        scene
      );
      emptyPictureMaterial.diffuseColor = new Color3(0.2, 0.4, 0.2);
      emptyPictureMaterial.specularPower = 0;

      const emptyPictureHoveredMaterial = new StandardMaterial(
        "emptyPictureHoveredMaterial",
        scene
      );
      emptyPictureHoveredMaterial.diffuseColor = new Color3(0.8, 0.4, 0.4);
      emptyPictureHoveredMaterial.specularPower = 0;
      const picture = MeshBuilder.CreateBox(
        "picture",
        {
          width,
          height,
          depth,
        },
        scene
      );

      picture.checkCollisions = true;
      picture.material = emptyPictureMaterial;
      picture.position = position;
      picture.rotation = rotation;

      this._mesh = picture;

      scene.onPointerObservable.add((pointerInfo) => {
        if (
          pointerInfo.type !== PointerEventTypes.POINTERDOWN ||
          !isObectsNear(scene.cameras[0], picture, 5)
        ) {
          return;
        }

        const ray = getCenterRay(scene, scene.cameras[0]);
        const hit = scene.pickWithRay(ray);

        if (hit?.pickedMesh === picture) {
          const hiddenFileInput = document.getElementById("hiddenFileInput");
          if (!hiddenFileInput) return;
          hiddenFileInput.click();
          hiddenFileInput.addEventListener("change", async (event) => {
            const target = event.target as HTMLInputElement;

            if (!target.files || !target.files.length) return;
            const file = target.files[0];
            const formData = new FormData();
            formData.append("place", String(place));
            formData.append("file", file);
            await fetch(`${app.baseUrl}/storage/upload`, {
              method: "POST",
              body: formData,
              credentials: "include",
            });
            await scene.drawPictures();
          });
        }
      });

      scene.onBeforeRenderObservable.add(() => {
        const ray = getCenterRay(scene, scene.cameras[0]);
        const hit = scene.pickWithRay(ray);

        if (
          hit &&
          hit.pickedMesh === picture &&
          isObectsNear(scene.cameras[0], picture, 5)
        ) {
          picture.material = emptyPictureHoveredMaterial;
        } else {
          picture.material = emptyPictureMaterial;
        }
      });
    } else {
      const material = new StandardMaterial("material", scene);
      material.specularPower = 0;

      const texture = new Texture(
        app.baseUrl + "/storage/pictures/" + path,
        scene
      );
      material.diffuseTexture = texture;

      const picture = MeshBuilder.CreateBox(
        "picture",
        {
          width,
          height,
          depth,
        },
        scene
      );

      texture.onLoadObservable.add(() => {
        const imgRatio = texture.getSize().width / texture.getSize().height;
        const planeRatio = picture.scaling.x / picture.scaling.y;

        if (imgRatio > planeRatio) {
          picture.scaling.y = picture.scaling.x / imgRatio;
        } else {
          picture.scaling.x = picture.scaling.y * imgRatio;
        }
      });

      picture.checkCollisions = true;
      picture.material = material;
      picture.position = position;
      picture.rotation = rotation;

      this._mesh = picture;
    }
  }

  dispose() {
    this._mesh.dispose();
  }
}
