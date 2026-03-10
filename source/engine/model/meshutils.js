import { CrossVector3D, SubCoord3D } from "../geometry/coord3d.js";
import { Transformation } from "../geometry/transformation.js";

export function IsEmptyMesh(mesh) {
  return mesh.LineCount() === 0 && mesh.TriangleCount() === 0;
}

export function CalculateTriangleNormal(v0, v1, v2) {
  if (v0 === undefined || v1 === undefined || v2 === undefined) {
    return { x: 0, y: 0, z: 1, Normalize() {} };
  }

  let v = SubCoord3D(v1, v0);
  let w = SubCoord3D(v2, v0);
  let normal = CrossVector3D(v, w);

  if (
    normal === undefined ||
    normal.x === undefined ||
    normal.y === undefined ||
    normal.z === undefined
  ) {
    return { x: 0, y: 0, z: 1, Normalize() {} };
  }

  normal.Normalize();
  return normal;
}

export function TransformMesh(mesh, transformation) {
  if (transformation.IsIdentity()) {
    return;
  }

  for (let i = 0; i < mesh.VertexCount(); i++) {
    let vertex = mesh.GetVertex(i);
    let transformed = transformation.TransformCoord3D(vertex);
    vertex.x = transformed.x;
    vertex.y = transformed.y;
    vertex.z = transformed.z;
  }

  if (mesh.NormalCount() > 0) {
    let normalMatrix = transformation.GetMatrix().InvertTranspose();
    if (normalMatrix !== null) {
      let normalTransformation = new Transformation(normalMatrix);
      for (let i = 0; i < mesh.NormalCount(); i++) {
        let normal = mesh.GetNormal(i);
        let transformed = normalTransformation.TransformCoord3D(normal);
        normal.x = transformed.x;
        normal.y = transformed.y;
        normal.z = transformed.z;
      }
    }
  }
}

export function FlipMeshTrianglesOrientation(mesh) {
  for (let i = 0; i < mesh.TriangleCount(); i++) {
    let triangle = mesh.GetTriangle(i);
    let tmp = triangle.v1;
    triangle.v1 = triangle.v2;
    triangle.v2 = tmp;
  }
}
