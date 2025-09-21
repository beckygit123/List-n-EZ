import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Conversation from "./Conversation";
import ChatSidebar from "./ChatSidebar";
import { Sparkles, Bot, User, Send, CornerDownLeft } from 'lucide-react';

// ... (keep the rest of the component as is for now)

export default function Chat() {
  const [pendingInput, setPendingInput] = useState("");
  const [aiChoice, setAiChoice] = useState(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const textareaRef = useRef(null);

  const sendMessage = useCallback(async (messageToSend) => {
    if (!aiChoice) {
      setShowChoiceModal(true);
      setPendingInput(messageToSend);
      return;
    }
    if (!messageToSend.trim() || isLoading) return;

    setIsLoading(true);
    setInput("");

    setConversationHistory(prev => [
      ...prev,
      { id: self.crypto.randomUUID(), type: 'user', message: messageToSend, timestamp: new Date() },
      { id: self.crypto.randomUUID(), type: 'ai', message: '', timestamp: new Date() }
    ]);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL || "http://localhost:3000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: messageToSend, aiChoice }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        setConversationHistory(currentHistory => {
          const newHistory = [...currentHistory];
          const lastMessage = newHistory[newHistory.length - 1];
          if (lastMessage && lastMessage.type === 'ai') {
            lastMessage.message += chunk;
          }
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Chat send message error:", error);
      const errorMessage = "Error: Could not connect to the AI agent. Please check your connection and try again.";
      setConversationHistory(currentHistory => {
        const newHistory = [...currentHistory];
        const lastMessage = newHistory[newHistory.length - 1];
        if (lastMessage && lastMessage.type === 'ai') {
          lastMessage.message = errorMessage;
          lastMessage.type = 'error';
        }
        return newHistory;
      });
    } finally {
      setIsLoading(false);
    }
  }, [aiChoice, isLoading]);

  useEffect(() => {
    if (aiChoice && pendingInput) {
      sendMessage(pendingInput);
      setPendingInput("");
    }
  }, [aiChoice, pendingInput, sendMessage]);

  const handleSendMessage = () => {
    sendMessage(input);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <>
      <AnimatePresence>
        {showChoiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700"
            >
              <div className="mx-auto bg-pink-100 dark:bg-pink-900/50 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Choose your AI</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">Select which AI model you'd like to use for this conversation.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black dark:from-gray-600 dark:to-gray-800 dark:hover:from-gray-700 dark:hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                  onClick={() => { setAiChoice('agent'); setShowChoiceModal(false); }}
                >
                  <Bot className="h-5 w-5" />
                  <span>List'n'<span className="text-pink-600 dark:text-pink-400">EZ</span></span>
                </button>
                <button
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
                  onClick={() => { setAiChoice('gemini'); setShowChoiceModal(false); }}
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Gemini</span>
                </button>
              </div>
              <button
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
                onClick={() => setShowChoiceModal(false)}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-6 p-4 sm:p-6">
        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="h-full bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700/50 p-4">
            <ChatSidebar onPromptClick={handlePromptClick} conversationHistory={conversationHistory} />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col h-full lg:col-span-9 min-h-0">
          {conversationHistory.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800/50 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700/50"
              >
                <div className="mx-auto bg-pink-100 dark:bg-pink-900/50 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                  <Bot className="h-10 w-10 text-pink-600 dark:text-pink-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">List'n'<span className="text-pink-600 dark:text-pink-400">EZ</span> Assistant</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
                  Your AI partner for reselling success. Start by asking a question below.
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-4 -mr-4">
              <Conversation history={conversationHistory} />
            </div>
          )}

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2">
              <textarea
                ref={textareaRef}
                id="chat-input"
                name="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-transparent border-none rounded-xl p-4 pr-24 resize-none focus:outline-none focus:ring-0 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Ask anything to supercharge your listings..."
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                  <kbd className="font-sans border rounded-md px-1.5 py-0.5">↵</kbd> for send
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-semibold p-3 rounded-full transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-pink-500/50"
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}