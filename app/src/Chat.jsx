import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Conversation from "./Conversation";
import ChatSidebar from "./ChatSidebar";

export default function Chat() {
  const [aiChoice, setAiChoice] = useState(null); // 'agent' or 'gemini'
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const sendMessage = useCallback(async (messageToSend) => {
    if (!aiChoice) {
      setShowChoiceModal(true);
      return;
    }
    if (!messageToSend.trim() || isLoading) return;

    setIsLoading(true);
    setInput("");

    // Add user message and an empty AI placeholder to history
    setConversationHistory(prev => [
      ...prev,
      { id: self.crypto.randomUUID(), type: 'user', message: messageToSend, timestamp: new Date() },
      { id: self.crypto.randomUUID(), type: 'ai', message: '', timestamp: new Date() } // AI placeholder
    ]);

    try {
      let apiUrl = "https://listynez.netlify.app/.netlify/functions/ask";
      if (aiChoice === "gemini") {
        apiUrl = "https://listynez.netlify.app/.netlify/functions/gemini";
      }
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: messageToSend }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let partialResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        partialResponse += chunk;

        const lines = partialResponse.split('\n');
        partialResponse = lines.pop() || ''; // Keep the last, possibly incomplete, line

        for (const line of lines) {
          if (line.trim() === '') continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              setConversationHistory(currentHistory => {
                const newHistory = [...currentHistory];
                const lastMessage = newHistory[newHistory.length - 1];
                if (lastMessage && lastMessage.type === 'ai') {
                  lastMessage.message += parsed.response;
                }
                return newHistory;
              });
            }
          } catch (e) {
            console.warn("Failed to parse streaming JSON chunk:", line);
          }
        }
      }
    } catch (error) {
      console.error("Chat send message error:", error);
      const errorMessage = "Error: Could not connect to the AI agent. Make sure the server is running.";
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
  }, [isLoading]);

  const handleSendMessage = () => {
    if (!aiChoice) {
      setShowChoiceModal(true);
    } else {
      sendMessage(input);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <AnimatePresence>
        {showChoiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Choose AI Provider</h2>
              <p className="mb-6 text-gray-600">Select which AI you want to use for this conversation.</p>
              <div className="flex gap-4 justify-center mb-6">
                <button
                  className="px-6 py-3 rounded-lg text-white font-semibold transition focus:outline-none group relative"
                  onClick={() => { setAiChoice("agent"); setShowChoiceModal(false); sendMessage(input); }}
                  style={{ backgroundColor: '#800000', boxShadow: '0 0 0 0px #800000', transition: 'box-shadow 0.2s, background-color 0.2s' }}
                  onMouseEnter={e => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.boxShadow = '0 0 20px 4px #800000';
                      e.currentTarget.style.backgroundColor = '#a52a2a';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 0 0 0px #800000';
                    e.currentTarget.style.backgroundColor = '#800000';
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'red',
                    pointerEvents: 'none',
                    zIndex: 2
                  }}>X</span>
                  <span style={{ position: 'relative', zIndex: 3 }}>LystynZ-Agent</span>
                </button>
                <button
                  className="px-6 py-3 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition focus:outline-none group"
                  onClick={() => { setAiChoice("gemini"); setShowChoiceModal(false); sendMessage(input); }}
                  style={{ boxShadow: '0 0 0 0px #a855f7' }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.boxShadow = '0 0 8px 2px #a855f7'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 0px #a855f7'; }}
                >
                  Gemini
                </button>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700 text-sm underline"
                onClick={() => setShowChoiceModal(false)}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 flex-shrink-0"
        >
          <div className="text-5xl mb-2">🤖</div>
          <h1 className="text-3xl font-bold text-gray-800">
            LystynZ-Agent
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Your AI assistant for reselling success.
          </p>
        </motion.div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <Conversation history={conversationHistory} />

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex-shrink-0"
            >
              <div className="space-y-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full h-24 border border-gray-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ask LystynZ-Agent anything..."
                  disabled={isLoading}
                />
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Shift+Enter for new line
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:cursor-not-allowed focus:outline-none group"
                    style={{ boxShadow: '0 0 0 0px #6366f1' }}
                    onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.boxShadow = '0 0 8px 2px #6366f1'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 0px #6366f1'; }}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Thinking...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Ask LystynZ-Agent</span>
                        <span>🚀</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block overflow-y-auto">
            <ChatSidebar onPromptClick={handlePromptClick} conversationHistory={conversationHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}