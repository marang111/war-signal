// src/components/PointsContainer.jsx
import { Sphere, Text } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function Point({ position, color, pointData }) { 
  const meshRef = useRef(); 
  const [hovered, setHovered] = useState(false);
  
  const handleClick = () => {
    console.log("Point Clicked! Data:", pointData); 
  };

  return (
    <Sphere 
      ref={meshRef} 
      args={[0.05, 16, 16]} 
      position={position} 
      
      onClick={handleClick}
      
      onPointerOver={(e) => { 
        e.stopPropagation(); 
        setHovered(true); 
        document.body.style.cursor = 'pointer'; 
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto'; 
      }}
    >
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={hovered ? 2.0 : 0.5} 
      />

      {hovered && pointData && (
        <Text
          position={[0, 0.5, 0]} 
          fontSize={0.2} 
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {pointData.dataName}
        </Text>
      )}
      
    </Sphere>
  );
}


function PointsContainer({ count = 100, radius = 30 }) {
  
  const points = useMemo(() => {
    const data = [];
    const R = radius; 
    
    for (let i = 0; i < count; i++) {
        let x, y, z;
        let distanceSquared;
        
        do {
            x = (Math.random() * 2 - 1) * R; 
            y = (Math.random() * 2 - 1) * R;
            z = (Math.random() * 2 - 1) * R;
            distanceSquared = x * x + y * y + z * z;
        } while (distanceSquared > R * R); 
        
        // 🔴 색상 변경: 초록색(0x00FF00)을 기준으로 무작위 밝기로 설정
        const color = new THREE.Color("red").multiplyScalar(Math.random() * 0.5 + 0.5); 
        
        data.push({
            position: [x, y, z],
            color: color.getHex(), // getHex()로 변경 (숫자 형식)
            id: i,
            dataName: `Data Point #${i + 1}`,
            detail: `이것은 ${i + 1}번째 점에 대한 상세 정보입니다.`,
            value: Math.floor(Math.random() * 1000)
        });
    }
    return data;
  }, [count, radius]);

  return (
    <>
      {points.map((point) => (
        <Point 
            key={point.id} 
            position={point.position} 
            color={point.color} 
            pointData={point}
        />
      ))}
    </>
  );
}

export default PointsContainer;
//정상