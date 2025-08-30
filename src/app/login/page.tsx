// src/app/login/page.tsx
'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const provider = new GoogleAuthProvider();

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err) {
            setError("Giriş bilgileri hatalı.");
            console.error("Login Error:", err);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userDocRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                });
            }
            router.push('/');
        } catch (err) {
            setError("Google ile giriş yapılamadı.");
            console.error("Google Sign-In Error:", err);
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-dot-white/[0.2]"></div>
            <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-white text-3xl font-bold text-center mb-2">Hoş Geldin</h2>
                <p className="text-neutral-400 text-center text-sm mb-8">Senkronize izleme deneyimi seni bekliyor.</p>
                
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGoogleSignIn} className="w-full font-semibold bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 mb-6">
                    <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c-.862-.21-33.824-8.718-33.824-8.718z"></path></svg>
                    Google ile Devam Et
                </motion.button>

                <div className="flex items-center gap-4 my-4"><hr className="w-full border-neutral-700"/><span className="text-neutral-500 text-xs">VEYA</span><hr className="w-full border-neutral-700"/></div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" type="email" className="w-full bg-black/40 placeholder:text-neutral-400 text-white p-3 rounded-lg border border-transparent focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" type="password" className="w-full bg-black/40 placeholder:text-neutral-400 text-white p-3 rounded-lg border border-transparent focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
                    {error && <p className="text-red-500 text-xs text-center pt-1">{error}</p>}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors duration-300">Giriş Yap</motion.button>
                </form>
                <p className="text-center text-xs text-neutral-400 mt-6">Hesabın yok mu? <Link href="/signup" className="font-semibold text-indigo-400 hover:underline">Şimdi Kayıt Ol</Link></p>
            </motion.div>
        </div>
    );
}