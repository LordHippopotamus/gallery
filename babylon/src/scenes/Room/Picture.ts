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
import {
  AdvancedDynamicTexture,
  Button,
  Control,
  Image,
  Rectangle,
  StackPanel,
} from "@babylonjs/gui";

export class Picture {
  private _mesh?: Mesh;
  private _modalOpen: boolean = false;

  constructor(
    scene: Room,
    width: number,
    height: number,
    depth: number,
    position: Vector3,
    rotation: Vector3,
    place: number,
    path: string | null,
    editable: boolean = false
  ) {
    if (!path && editable) {
      const emptyPictureMaterial = new StandardMaterial(
        "emptyPictureMaterial",
        scene
      );
      emptyPictureMaterial.diffuseColor = new Color3(0.2, 0.4, 0.2);
      emptyPictureMaterial.specularPower = 0;

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
          !isObectsNear(scene.cameras[0], picture, 5) ||
          !document.pointerLockElement
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
          emptyPictureMaterial.emissiveColor = new Color3(0.1, 0.1, 0.1);
        } else {
          emptyPictureMaterial.emissiveColor = new Color3(0, 0, 0);
        }
      });
    } else if (path) {
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

      scene.onBeforeRenderObservable.add(() => {
        const ray = getCenterRay(scene, scene.cameras[0]);
        const hit = scene.pickWithRay(ray);

        if (
          hit &&
          hit.pickedMesh === picture &&
          isObectsNear(scene.cameras[0], picture, 5)
        ) {
          material.emissiveColor = new Color3(0.1, 0.1, 0.1);
        } else {
          material.emissiveColor = new Color3(0, 0, 0);
        }
      });

      scene.onPointerObservable.add((pointerInfo) => {
        if (
          pointerInfo.type !== PointerEventTypes.POINTERDOWN ||
          !isObectsNear(scene.cameras[0], picture, 5) ||
          this._modalOpen
        ) {
          return;
        }

        const ray = getCenterRay(scene, scene.cameras[0]);
        const hit = scene.pickWithRay(ray);

        if (hit?.pickedMesh === picture) {
          this._modalOpen = true;
          scene.disallowControls();
          const advancedTexture =
            AdvancedDynamicTexture.CreateFullscreenUI("UI");

          const mainWindow = new Rectangle("mainWindow");
          mainWindow.width = "80%";
          mainWindow.height = "80%";
          mainWindow.cornerRadius = 10;
          mainWindow.color = "white";
          mainWindow.thickness = 2;
          mainWindow.background = "white";

          advancedTexture.addControl(mainWindow);

          const contentStack = new StackPanel("contentStack");
          contentStack.width = "100%";
          contentStack.height = "100%";
          contentStack.paddingTop = "20px";
          contentStack.paddingLeft = "20px";
          contentStack.paddingRight = "20px";
          contentStack.paddingBottom = "20px";
          mainWindow.addControl(contentStack);

          const image = new Image(
            "mainImage",
            app.baseUrl + "/storage/pictures/" + path
          );
          image.width = "100%";
          image.height = "85%";
          image.stretch = Image.STRETCH_UNIFORM;
          contentStack.addControl(image);

          const buttonPanel = new StackPanel("buttonPanel");

          buttonPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
          buttonPanel.isVertical = false;
          buttonPanel.spacing = 10;
          contentStack.addControl(buttonPanel);

          const button1 = Button.CreateSimpleButton("Close", "Close");
          button1.width = "120px";
          button1.height = "40px";
          button1.color = "white";
          button1.cornerRadius = 5;
          button1.background = "#757474";
          button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
          button1.onPointerUpObservable.add(() => {
            advancedTexture.dispose();
            this._modalOpen = false;
            scene.allowControls();
          });
          buttonPanel.addControl(button1);

          if (editable) {
            const button2 = Button.CreateSimpleButton("Delete", "Delete");
            button2.width = "120px";
            button2.height = "40px";
            button2.color = "white";
            button2.cornerRadius = 5;
            button2.background = "#d95757";
            button2.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            button2.onPointerUpObservable.add(async () => {
              await fetch(app.baseUrl + "/storage/pictures/" + path, {
                method: "post",
                credentials: "include",
              });
              advancedTexture.dispose();
              this._modalOpen = false;
              scene.allowControls();
              await scene.drawPictures();
            });
            buttonPanel.addControl(button2);
          }
        }
      });
    }
  }

  dispose() {
    if (this._mesh) {
      this._mesh.dispose();
    }
  }
}
