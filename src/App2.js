import { Canvas } from "@react-three/fiber";
import FacePointCloudFromImage from "./FacePointCloudFromImage";

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.6] }}
      style={{ width: "100vw", height: "100vh", background: "black" }}
    >
      <FacePointCloudFromImage />
    </Canvas>
  );
}
//얼굴보이는 버전