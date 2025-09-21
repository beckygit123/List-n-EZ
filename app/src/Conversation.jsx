import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Message = ({ msg }) => {
  const isUser = msg.type === 'user';
  const isError = msg.type === 'error';

  const Icon = isUser ? User : (isError ? AlertTriangle : Bot);
  
  const bubbleClasses = isUser
    ? 'bg-pink-600 text-white'
    : isError
    ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{
        opacity: { duration: 0.2 },
        layout: { type: "spring", bounce: 0.3, duration: 0.4 }
      }}
      className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isError ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
          <Icon size={18} className={isError ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
        </div>
      )}
      <div className={`max-w-[85%] p-4 rounded-2xl ${bubbleClasses}`}>
        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:before:content-none prose-p:after:content-none">
          <ReactMarkdown>{msg.message || '...'}</ReactMarkdown>
        </div>
        <span className={`text-xs opacity-60 mt-2 block text-right`}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
       {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-pink-100 dark:bg-pink-900/50">
          <Icon size={18} className="text-pink-600 dark:text-pink-400" />
        </div>
      )}
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
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="space-y-6 p-1">
        <AnimatePresence initial={false}>
          {history.map((msg) => <Message key={msg.id} msg={msg} />)}
        </AnimatePresence>
      </div>
    </div>
  );
}