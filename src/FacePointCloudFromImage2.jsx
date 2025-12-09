import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function FacePointCloudFromImage() {
  const pointsRef = useRef();
  const [positions, setPositions] = useState(null);

  // ---------------------------
  // 원형 텍스처 생성
  // ---------------------------
  function createCircleTexture() {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  const circleTexture = createCircleTexture();

  // ---------------------------
  // 이미지 로딩 → 포인트 클라우드 생성
  // ---------------------------
  useEffect(() => {
    const img = new Image();
    img.src = "/face.jpg";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, img.width, img.height).data;

      const maxPoints = 30000;
      const pts = [];

      let tries = 0;

      while (pts.length / 3 < maxPoints && tries < maxPoints * 80) {
        tries++;

        const x = Math.floor(Math.random() * img.width);
        const y = Math.floor(Math.random() * img.height);

        const idx = (y * img.width + x) * 4;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        const brightness = (r + g + b) / 3 / 255;

        if (Math.random() > brightness * 0.75) continue;

        const nx = (x / img.width) * 2 - 1;
        const ny = -(y / img.height) * 2 + 1;

        // ---------------------------
        // 진짜 3D 얼굴 깊이
        // ---------------------------
        const dist = Math.sqrt(nx * nx + ny * ny);

        // 두개골 기본 모양 (가운데 볼록, 바깥쪽 들어감)
        let skull = Math.cos(dist * Math.PI * 0.9);

        // 밝기 기반 깊이
        let lightDepth = (brightness - 0.5) * 0.8;

        // 코 강화
        if (Math.abs(nx) < 0.15 && ny > -0.15) {
          skull += 0.25;
        }

        const depthScale = 1.3;
        const nz = (skull + lightDepth) * depthScale;

        pts.push(nx, ny, nz);
      }

      setPositions(new Float32Array(pts));
    };
  }, []);

  // 회전
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0018;
    }
  });

  if (!positions) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.01}
        map={circleTexture}
        alphaMap={circleTexture}
        transparent={true}
        alphaTest={0.5}
        depthWrite={false}
        color="white"
        sizeAttenuation={true}
      />
    </points>
  );
}
