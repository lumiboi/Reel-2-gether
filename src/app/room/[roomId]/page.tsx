// src/app/room/[roomId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, DocumentData, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import LocalVideoPlayer from '@/components/LocalVideoPlayer';
import Chat from '@/components/Chat';
import { Copy, Users, LogIn, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Participant {
    uid: string;
    name: string;
    photoURL?: string;
}

export default function RoomPage() {
    const { user, loading: authLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;
    const [roomData, setRoomData] = useState<DocumentData | null>(null);
    const [videoPool, setVideoPool] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const isHost = user && roomData && user.uid === roomData.hostUid;

    const copyRoomLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleNextVideo = useCallback(async () => {
        if (!isHost || videoPool.length === 0) return;
        const roomDocRef = doc(db, 'rooms', roomId);
        const randomIndex = Math.floor(Math.random() * videoPool.length);
        const nextVideo = videoPool[randomIndex];
        await updateDoc(roomDocRef, { currentVideo: `/havuz/${nextVideo}`, currentTime: 0, playbackState: 'playing' });
    }, [isHost, roomId, videoPool]);

    const handlePlaybackToggle = async () => {
        if (!isHost || !roomData?.currentVideo) return;
        const roomDocRef = doc(db, 'rooms', roomId);
        const newState = roomData?.playbackState === 'playing' ? 'paused' : 'playing';
        await updateDoc(roomDocRef, { playbackState: newState });
    };

    const handleTimeUpdate = useCallback(async (time: number) => {
        if (isHost && roomData?.playbackState === 'playing') {
            const roomDocRef = doc(db, 'rooms', roomId);
            await updateDoc(roomDocRef, { currentTime: time });
        }
    }, [isHost, roomId, roomData?.playbackState]);

    useEffect(() => {
        if (!user || !roomId) return;
        const roomDocRef = doc(db, 'rooms', roomId);
          const participantData = {
            uid: user.uid,
            name: user.displayName || user.email || "Misafir", // Eğer ikisi de yoksa "Misafir" yaz
            photoURL: user.photoURL || null // Eğer photoURL yoksa, undefined yerine null gönder
        };
        const handleBeforeUnload = () => { updateDoc(roomDocRef, { participants: arrayRemove(participantData) }); };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            updateDoc(roomDocRef, { participants: arrayRemove(participantData) });
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [user, roomId]);

    useEffect(() => { fetch('/api/videos').then(res => res.json()).then(setVideoPool) }, []);

    useEffect(() => {
        if (!roomId) return;
        const roomDocRef = doc(db, 'rooms', roomId);
        const unsubscribe = onSnapshot(roomDocRef, (doc) => {
            if (doc.exists()) {
                setRoomData(doc.data());
            } else {
                router.push('/');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [roomId, router]);

    if (authLoading || loading) {
        return <div className="flex h-screen items-center justify-center bg-black"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div></div>;
    }
  
    if (!user) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-black p-4 text-center">
                <h2 className="text-white text-3xl mb-6">Bu odayı görmek için giriş yapmalısınız.</h2>
                <div className="flex gap-4"><Link href="/login" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center gap-2"><LogIn size={18}/> Giriş Yap</Link><Link href="/signup" className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2"><Plus size={18}/> Kayıt Ol</Link></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-black bg-dot-white/[0.1] text-white p-4 gap-4 overflow-hidden">
            <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0 flex justify-between items-center z-20">
                <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"><ArrowLeft size={18}/> Lobiye Dön</Link>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">ReelTogether Odası</h1>
                <div className="w-32"></div>
            </motion.header>
            
            <div className="flex-grow flex flex-col md:flex-row gap-4 min-h-0">
                <div className="flex-grow flex flex-col items-center min-w-0">
                    <div className="relative w-full h-full bg-black/40 rounded-2xl border border-white/[0.1] flex items-center justify-center p-1">
                        {roomData?.currentVideo ? (
                            <LocalVideoPlayer src={roomData.currentVideo} playbackState={roomData.playbackState} syncTime={roomData.currentTime} isHost={isHost || false} onTimeUpdate={handleTimeUpdate} />
                        ) : (
                            <p className="text-gray-400 text-xl">{isHost ? "Başlamak için 'Rastgele Video'ya bas." : "Kurucu bekleniyor..."}</p>
                        )}
                    </div>
                    {isHost && (
                        <div className="flex-shrink-0 flex space-x-4 mt-4 z-10">
                            <button onClick={handlePlaybackToggle} disabled={!roomData?.currentVideo} className="px-6 py-2 bg-blue-600 font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-500">{roomData?.playbackState === 'playing' ? 'Durdur' : 'Oynat'}</button>
                            <button onClick={handleNextVideo} disabled={videoPool.length === 0} className="px-6 py-2 bg-green-600 font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-500">Rastgele Video</button>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col gap-4 min-h-0">
                    <div className="flex-shrink-0 bg-black/20 backdrop-blur-sm border border-white/[0.1] rounded-2xl p-4">
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Users size={20}/> Katılımcılar ({roomData?.participants?.length || 0})</h2>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
                            {roomData?.participants?.map((p: Participant) => (<div key={p.uid} className="bg-gray-700 text-sm px-3 py-1 rounded-full">{p.name}</div>))}
                        </div>
                        <button onClick={copyRoomLink} className="w-full text-left mt-4 p-3 bg-white/5 rounded-lg flex items-center justify-between hover:bg-white/10">
                            <span className="text-sm text-neutral-300">{copied ? 'Link Kopyalandı!' : 'Davet Linkini Kopyala'}</span>
                            <Copy size={16} className="text-neutral-400"/>
                        </button>
                    </div>
                    <div className="flex-grow min-h-0">
                        <Chat roomId={roomId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
