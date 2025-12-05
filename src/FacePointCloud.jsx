// FacePointCloud3D.jsx
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export default function FacePointCloud3D() {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const count = 2000;
    const pts = [];

    // 얼굴 비율 (대략적인 사람 얼굴 형태의 3D 타원체)
    const headRadiusX = 1.0;
    const headRadiusY = 1.25;
    const headRadiusZ = 0.8;

    const addPoint = (x, y, z, boost = false) => {
      // boost면 해당 위치에 주변으로 점 1~2개 더 생성 (눈/코/입)
      pts.push(x, y, z);
      if (boost && pts.length < count * 3) {
        pts.push(
          x + (Math.random() - 0.5) * 0.03,
          y + (Math.random() - 0.5) * 0.03,
          z + (Math.random() - 0.5) * 0.03
        );
      }
    };

    while (pts.length / 3 < count) {
      // 3D 타원체 내부 랜덤 샘플링
      let x, y, z;
      x = (Math.random() * 2 - 1) * headRadiusX;
      y = (Math.random() * 2 - 1) * headRadiusY;
      z = (Math.random() * 2 - 1) * headRadiusZ;

      const inside =
        (x * x) / (headRadiusX * headRadiusX) +
          (y * y) / (headRadiusY * headRadiusY) +
          (z * z) / (headRadiusZ * headRadiusZ) <=
        1.0;

      if (!inside) continue;

      // 얼굴 특징을 만들기 위한 확률적 보정

      // 1) 코 (정가운데 윗부분 돌출)
      if (Math.abs(x) < 0.15 && y > -0.2 && y < 0.3 && Math.random() < 0.1) {
        addPoint(x * 0.5, y, z + 0.25, true);
        continue;
      }

      // 2) 눈 (좌/우 약간 움푹)
      if (Math.abs(y - 0.2) < 0.15 && Math.random() < 0.08) {
        if (x < -0.35) addPoint(x, y, z - 0.1, true);
        if (x > 0.35) addPoint(x, y, z - 0.1, true);
        continue;
      }

      // 3) 입
      if (y < -0.35 && Math.abs(x) < 0.45 && Math.random() < 0.06) {
        addPoint(x, y, z - 0.15, true);
        continue;
      }

      // 4) 광대 강조 (양쪽)
      if (Math.abs(x) > 0.5 && Math.abs(y) < 0.2 && Math.random() < 0.07) {
        addPoint(x * 1.1, y, z, true);
        continue;
      }

      // 기본 점
      addPoint(x, y, z, false);
    }

    return new Float32Array(pts.slice(0, count * 3));
  }, []);

  // 천천히 회전
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0015;
    }
  });

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
        color={"white"}
        sizeAttenuation={true}
      />
    </points>
  );
}
