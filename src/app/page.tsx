// src/app/page.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { LogOut, Plus, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [roomCode, setRoomCode] = useState('');

    const handleCreateRoom = async () => {
        if (!user) return;
        setIsCreatingRoom(true);
        try {
            const newRoomRef = await addDoc(collection(db, 'rooms'), {
                hostUid: user.uid,
                hostName: user.displayName || user.email,
                createdAt: serverTimestamp(),
                currentVideo: null,
                playbackState: 'paused',
                currentTime: 0,
                participants: [{ uid: user.uid, name: user.displayName || user.email, photoURL: user.photoURL }],
            });
            router.push(`/room/${newRoomRef.id}`);
        } catch (error) {
            console.error("Oda oluşturulurken hata:", error);
            setIsCreatingRoom(false);
        }
    };

    if (loading) return <div className="fixed inset-0 w-full h-full bg-black z-50" />;
    
    if (!user) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
                <h1 className="md:text-6xl text-3xl lg:text-8xl font-bold text-center text-white relative z-20">ReelTogether</h1>
                <p className="text-neutral-300 text-center mt-4 mb-8 z-20">Arkadaşlarınla. Senkronize. Kesintisiz.</p>
                <div className="flex gap-4 z-20">
                    <Link href="/login" className="px-6 py-3 bg-white text-black rounded-lg font-semibold flex items-center gap-2">Giriş Yap</Link>
                    <Link href="/signup" className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold flex items-center gap-2">Kayıt Ol</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black p-4">
             <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 transform scale-[0.80] rounded-full blur-3xl opacity-50" />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 right-6 z-20">
                <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <LogOut size={16} /> Çıkış Yap
                </button>
            </motion.div>
            <div className="z-10 flex flex-col items-center text-center">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 mb-12">
                    Ne yapmak istersin?
                </motion.h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }} className="p-8 border border-white/10 bg-black/40 backdrop-blur-lg rounded-2xl flex flex-col items-center">
                        <h2 className="text-3xl font-bold text-white">Yeni Oda Kur</h2>
                        <p className="text-neutral-400 mt-2 mb-6">Yeni bir izleme partisi başlat.</p>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCreateRoom} disabled={isCreatingRoom} className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center gap-2">
                            <Plus size={20} /> {isCreatingRoom ? 'Kuruluyor...' : 'Hemen Kur'}
                        </motion.button>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }} className="p-8 border border-white/10 bg-black/40 backdrop-blur-lg rounded-2xl flex flex-col items-center">
                        <h2 className="text-3xl font-bold text-white">Odaya Katıl</h2>
                        <p className="text-neutral-400 mt-2 mb-6">Arkadaşının kodunu girerek katıl.</p>
                        <form onSubmit={(e) => { e.preventDefault(); router.push(`/room/${roomCode}`); }} className="flex w-full">
                            <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Oda Kodu..." className="flex-grow p-3 bg-black/40 placeholder:text-neutral-400 text-white rounded-l-lg border border-transparent focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                            <button type="submit" className="px-5 bg-indigo-600 text-white font-semibold rounded-r-lg"><ArrowRight/></button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}