import * as THREE from "three";
import { useEffect, useRef, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function FacePointCloudFromImage() {
  const pointsRef = useRef();
  const [positions, setPositions] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  
  // R3F 캔버스 요소를 가져오기 위해 useThree 사용
  const { gl } = useThree(); 

  useEffect(() => {
    // 이전 로직과 동일하게 이미지 데이터를 가져와 점 위치(positions) 생성
    const img = new Image();
    img.src = "/face.jpg";  

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

        if (Math.random() > brightness * 0.75) continue;

        const nx = (x / img.width) * 2 - 1;
        const ny = -(y / img.height) * 2 + 1;

        const depthStrength = 10;
        const nz = (brightness - 0.5) * depthStrength;

        pts.push(nx, ny, nz);
      }

      setPositions(new Float32Array(pts));
    };
  }, []);

  // ************************************************
  // 자동 회전 및 멈춤 제어
  // ************************************************
  useFrame(() => {
    if (pointsRef.current && isRotating) {
      pointsRef.current.rotation.y += 0.0018;
    }
  });

  // ************************************************
  // 클릭/드래그 이벤트 핸들러
  // ************************************************
  const handleInteractionStart = useCallback(() => {
    // 마우스가 눌리거나 터치가 시작되면 자동 회전 멈춤
    setIsRotating(false); 
    // 마우스 커서 스타일 변경 (옵션)
    gl.domElement.style.cursor = 'grabbing';
  }, [gl.domElement]);

  const handleInteractionEnd = useCallback(() => {
    // 마우스 버튼을 놓으면 자동 회전 재개
    setIsRotating(true);
    // 마우스 커서 스타일 복원 (옵션)
    gl.domElement.style.cursor = 'pointer'; 
  }, [gl.domElement]);
  
  // 마우스 이벤트 리스너 등록 (컴포넌트가 마운트될 때)
  useEffect(() => {
    const element = gl.domElement;
    
    // 이벤트를 캔버스 요소에 직접 연결
    element.addEventListener('mousedown', handleInteractionStart);
    element.addEventListener('touchstart', handleInteractionStart);
    element.addEventListener('mouseup', handleInteractionEnd);
    element.addEventListener('touchend', handleInteractionEnd);

    // 클린업 함수
    return () => {
      element.removeEventListener('mousedown', handleInteractionStart);
      element.removeEventListener('touchstart', handleInteractionStart);
      element.removeEventListener('mouseup', handleInteractionEnd);
      element.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [handleInteractionStart, handleInteractionEnd, gl.domElement]);


  if (!positions) return null;

  return (
    // points 컴포넌트에 클릭 가능한 요소로 만들기 위해 이벤트 핸들러를 추가합니다.
    <points 
        ref={pointsRef}
        // Raycasting 감지를 위해 onClick, onPointerOver 등 이벤트 핸들러 사용
        // 이 포인트 클라우드 자체는 클릭 가능한 요소로 간주됩니다.
        onClick={(e) => {
            // e.stopPropagation(); // 이벤트 전파 중지 (필요하다면)
            console.log("Point cloud clicked!");
        }}
    >
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
        // ************************************************
        // sizeAttenuation: false로 설정하면 화면에 비례하여 크기가 고정되어
        // 점이 더 동그란 모양에 가깝고 일정하게 보입니다.
        // ************************************************
        sizeAttenuation={false} 
      />
    </points>
  );
}