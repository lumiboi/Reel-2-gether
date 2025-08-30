// src/app/signup/page.tsx
'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!displayName) { setError("Kullanıcı adı gerekli."); return; }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName });
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            });
            router.push('/');
        } catch (err) {
            setError("Kayıt başarısız, lütfen bilgileri kontrol et.");
            console.error("Sign Up Error:", err);
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-dot-white/[0.2]"></div>
            <motion.div initial={{ opacity: 0, y: -50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-lg">
                <h2 className="text-white text-3xl font-bold text-center mb-2">Maceraya Katıl</h2>
                <p className="text-neutral-400 text-center text-sm mb-8">Yeni bir hesap oluştur.</p>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Kullanıcı Adı" type="text" className="w-full bg-black/40 placeholder:text-neutral-400 text-white p-3 rounded-lg border border-transparent focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" type="email" className="w-full bg-black/40 placeholder:text-neutral-400 text-white p-3 rounded-lg border border-transparent focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" type="password" className="w-full bg-black/40 placeholder:text-neutral-400 text-white p-3 rounded-lg border border-transparent focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
                    {error && <p className="text-red-500 text-xs text-center pt-1">{error}</p>}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors duration-300 mt-4">Kayıt Ol</motion.button>
                </form>
                <p className="text-center text-xs text-neutral-400 mt-6">Zaten bir hesabın var mı? <Link href="/login" className="font-semibold text-indigo-400 hover:underline">Giriş Yap</Link></p>
            </motion.div>
        </div>
    );
}