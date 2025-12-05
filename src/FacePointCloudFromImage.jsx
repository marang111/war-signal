import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function FacePointCloudFromImage() {
  const pointsRef = useRef();
  const [positions, setPositions] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/face.jpg";  // public에 저장된 네가 준 얼굴 이미지

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

      const maxPoints = 30000;
      const pts = [];

      let tries = 0;

      while (pts.length / 3 < maxPoints && tries < maxPoints * 80) {
        tries++;

        const x = Math.floor(Math.random() * img.width);
        const y = Math.floor(Math.random() * img.height);
        const idx = (y * img.width + x) * 4;

        const r = imageData[idx];
        const g = imageData[idx + 1];
        const b = imageData[idx + 2];

        const brightness = (r + g + b) / 3 / 255;

        // 얼굴 명암 특성을 활용해 점 생성 확률 조정
        if (Math.random() > brightness * 0.75) continue;

        // -1 ~ 1 범위 정규화
        const nx = (x / img.width) * 2 - 1;
        const ny = -(y / img.height) * 2 + 1;

        // ************************************************
        // 핵심 깊이맵 (구형 왜곡 제거 + 얼굴 구조 반영)
        // ************************************************
        const depthStrength = 0.55;
        const nz = (brightness - 0.5) * depthStrength;

        pts.push(nx, ny, nz);
      }

      setPositions(new Float32Array(pts));
    };
  }, []);

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
        size={0.015}
        color="white"
        sizeAttenuation
      />
    </points>
  );
}
