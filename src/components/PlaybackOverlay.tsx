// src/components/PlaybackOverlay.tsx
'use client';

interface PlaybackOverlayProps {
  onReadyClick: () => void;
  isReady: boolean;
}

export const PlaybackOverlay = ({ onReadyClick, isReady }: PlaybackOverlayProps) => {
  return (
    <div 
      onClick={!isReady ? onReadyClick : undefined}
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center text-center rounded-lg transition-all duration-300 ${!isReady ? 'cursor-pointer bg-black bg-opacity-60 backdrop-blur-sm' : 'cursor-default'}`}
    >
      {isReady ? (
        <div className="p-4 bg-black bg-opacity-70 rounded-lg">
          <h2 className="text-2xl font-bold text-white">Hazırsın!</h2>
          <p className="text-gray-300">Diğer oyuncu bekleniyor...</p>
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-2xl font-bold text-white">Başlatmak için Tıkla</h2>
          <p className="text-gray-300">Herkes tıkladığında video başlayacak.</p>
        </div>
      )}
    </div>
  );
};


