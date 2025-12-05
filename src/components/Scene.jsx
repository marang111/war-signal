// src/components/Scene.jsx

import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber'; 
import { useRef } from 'react'; 
import PointsContainer from './PointsContainer'; 

function Scene() {
    
  const PI = Math.PI;
  const groupRef = useRef(); 
  
  // // 매 프레임마다 데이터 그룹을 회전시켜 '굴러가는' 효과를 만듭니다.
  // useFrame((state, delta) => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.x += delta * 0.2;
  //     groupRef.current.rotation.y += delta * 0.2;
  //   }
  // });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* 회전을 위한 그룹으로 PointsContainer를 감쌉니다. */}
      <group ref={groupRef}> 
        <PointsContainer count={2000} range={10} /> 
      </group>

      {/* 카메라 컨트롤러 최종 설정 */}
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05} 
        zoomSpeed={2.0} 
        
        // 수직 회전 제한 해제 (180도)
        maxPolarAngle={PI} 
        minPolarAngle={0}  
        
        // 🔴 줌 아웃 제한 (최대 30 유닛까지만 멀어질 수 있음)
        maxDistance={50} 
        // 줌 인 제한 (1 유닛보다 가까이 못 가게 하여 파고드는 것을 방지)
        minDistance={1} 
      />
    </>
  );
}

export default Scene;
//정상