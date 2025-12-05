import { Canvas } from '@react-three/fiber';
import MusicPlayer from './components/MusicPlayer';
import Scene from './components/Scene.jsx';

function App() {

  const musicPath = "/music/into-the-mist-forest-166203.mp3"; 
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000000', position: 'relative' }}>
      
      <MusicPlayer src={musicPath} />

      <Canvas 
          camera={{ fov: 75, position: [0, 0, 10] }}>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
//정상