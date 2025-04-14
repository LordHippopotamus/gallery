import {
  Scene,
  Camera,
  Ray,
  Matrix,
  AbstractMesh,
  Vector3,
} from "@babylonjs/core";

export function getCenterRay(scene: Scene, camera: Camera): Ray {
  return scene.createPickingRay(
    scene.getEngine().getRenderWidth() / 2,
    scene.getEngine().getRenderHeight() / 2,
    Matrix.Identity(),
    camera
  );
}

export function isObectsNear(
  camera: Camera,
  button: AbstractMesh,
  maxDistance: number
): boolean {
  return (
    Vector3.Distance(camera.position, button.absolutePosition) <= maxDistance
  );
}
