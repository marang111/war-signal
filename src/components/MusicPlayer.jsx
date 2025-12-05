import { useRef, useState } from 'react';

/**
 * @param {string} src "../../public/music/pudevoted_guard.mp3";
 */
function MusicPlayer({ src }) {
  // 1. <audio> 요소를 참조하기 위해 useRef 사용
  const audioRef = useRef(null);
  
  // 2. 재생 상태를 관리하기 위해 useState 사용
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 3. 사용자가 실수로 여러 번 클릭하거나, 재생이 끝났을 때 상태를 업데이트하는 함수
  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      // 멈춤
      audio.pause();
    } else {
      // 재생
      audio.play().catch(error => {
        console.error("오디오 재생 실패:", error);
        // 대부분의 브라우저는 사용자의 상호작용 없이는 자동 재생을 막습니다.
      }); 
    }
    // 상태 반전
    setIsPlaying(!isPlaying);
  };
  
  // 음악이 끝났을 때 상태를 자동으로 '정지됨'으로 바꾸는 이벤트 핸들러
  const handleEnded = () => {
    // loop 속성을 사용하지 않는 경우, 재생이 끝나면 상태를 false로 변경합니다.
    // setIsPlaying(false); 
    // 현재는 <audio loop />를 사용하므로 이 로직은 주석 처리합니다.
  };

  return (
    <div 
      style={{ 
        position: 'absolute', // 3D 캔버스 위에 배치하기 위해 absolute 사용
        top: 20, 
        left: 20, 
        zIndex: 1000, // 캔버스보다 위에 오도록 z-index 설정
        padding: '10px', 
        backgroundColor: 'rgba(202, 202, 202, 0.17)',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0)'
      }}
    >
      
      {/* 🔴 HTML5 <audio> 태그: ref로 참조하고, loop로 반복 설정 */}
      <audio 
        ref={audioRef} 
        src={src} 
        loop // 반복 재생
        onEnded={handleEnded} 
        // controls 속성을 제거하여 사용자 정의 버튼만 사용하도록 합니다.
      />
      
      {/* 🔴 컨트롤 버튼 */}
      <button onClick={togglePlayPause} style={{ padding: '8px 12px', cursor: 'pointer' }}>
        {isPlaying ? '⏸️ 일시 정지' : '▶️ 음악 재생'}
      </button>

      <p style={{ fontSize: '12px', marginTop: '5px' }}>
          상태: **{isPlaying ? '재생 중' : '정지됨'}**
      </p>
    </div>
  );
}

export default MusicPlayer;
//정상