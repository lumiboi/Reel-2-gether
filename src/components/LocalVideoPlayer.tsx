// src/components/LocalVideoPlayer.tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';

interface LocalVideoPlayerProps {
  src: string;
  playbackState: 'playing' | 'paused';
  syncTime: number;
  isHost: boolean;
  onTimeUpdate: (time: number) => void;
}

const LocalVideoPlayer = ({ src, playbackState, syncTime, isHost, onTimeUpdate }: LocalVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playbackState === 'playing' && video.paused) {
      video.play().catch(error => console.error("Otomatik oynatma engellendi:", error));
    } else if (playbackState === 'paused' && !video.paused) {
      video.pause();
    }
    
    // Zaman senkronizasyonu için eşiği biraz artıralım ki takılmasın
    if (Math.abs(video.currentTime - syncTime) > 2) { 
      video.currentTime = syncTime;
    }

  }, [playbackState, syncTime, src]);

  const timeUpdater = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  }, [onTimeUpdate]);

  useEffect(() => {
    if (isHost) {
      intervalRef.current = setInterval(timeUpdater, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHost, timeUpdater]);

  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      controls={isHost}
      // --- ANA DEĞİŞİKLİK BURADA ---
      // `object-cover` yerine `object-contain` kullanarak videonun taşmasını engelle
      className="w-full h-full object-contain"
      muted
      autoPlay={playbackState === 'playing'}
    />
  );
};

export default LocalVideoPlayer;