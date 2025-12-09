import { Canvas } from "@react-three/fiber";
import FacePointCloudFromImage from "./FacePointCloudFromImage";
import { OrbitControls } from "@react-three/drei";

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.4] }}
      style={{ width: "100vw", height: "100vh", background: "black" }}
    >
      <OrbitControls
        enableZoom={true}
        enableRotate={true}
        enablePan={true}
        minDistance={0.5}
        maxDistance={10}
      />
      <FacePointCloudFromImage />
    </Canvas>
  );
}
