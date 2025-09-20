import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Message = ({ msg }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, x: msg.type === 'user' ? 20 : -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        opacity: { duration: 0.2 },
        layout: { type: "spring", bounce: 0.3, duration: 0.4 }
      }}
      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`
        max-w-[80%] p-3 rounded-2xl
        ${msg.type === 'user' 
          ? 'bg-blue-500 text-white' 
          : msg.type === 'error'
          ? 'bg-red-100 text-red-800 border border-red-200'
          : 'bg-gray-100 text-gray-800'
        }
      `}>
        <p className="text-sm whitespace-pre-wrap">{msg.message || '...'}</p>
        <span className={`text-xs opacity-70 mt-1 block ${
          msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {msg.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};

export default function Conversation({ history }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  if (history.length === 0) {
    return null;
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 bg-white rounded-2xl shadow-lg p-6 mb-6 overflow-y-auto"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800 sticky top-0 bg-white/80 backdrop-blur-sm py-2 z-10">
        💬 Conversation History
      </h3>
      <div className="space-y-4">
        <AnimatePresence>
          {history.map((msg) => <Message key={msg.id} msg={msg} />)}
        </AnimatePresence>
      </div>
    </div>
  );
}