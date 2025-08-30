// src/components/Chat.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

interface ChatProps {
  roomId: string;
}

interface Message {
  id: string;
  text: string;
  senderName: string;
  senderUid: string;
}

export default function Chat({ roomId }: ChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;
    const q = query(collection(db, 'rooms', roomId, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });
    return () => unsubscribe();
  }, [roomId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;
    await addDoc(collection(db, 'rooms', roomId, 'messages'), {
      text: newMessage,
      senderName: user.displayName || user.email,
      senderUid: user.uid,
      timestamp: serverTimestamp(),
    });
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-black/50 backdrop-blur-sm border border-white/[0.2] rounded-2xl p-4">
      <h2 className="flex-shrink-0 text-xl font-bold text-white mb-4 border-b border-white/[0.2] pb-2">Sohbet</h2>
      <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-3 p-3 rounded-lg max-w-[80%] w-fit ${
                msg.senderUid === user?.uid
                  ? 'bg-indigo-600 ml-auto'
                  : 'bg-gray-700 mr-auto'
              }`}
            >
              <p className="text-xs text-gray-300 font-bold mb-1">{msg.senderName}</p>
              <p className="text-white break-words">{msg.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex-shrink-0 mt-4 flex">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesajını yaz..."
          className="flex-grow p-3 bg-gray-800 text-white rounded-l-lg border-y border-l border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="px-4 bg-indigo-600 text-white rounded-r-lg flex items-center justify-center hover:bg-indigo-700 transition-colors">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}