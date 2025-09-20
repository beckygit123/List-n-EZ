import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Conversation from "./Conversation";
import ChatSidebar from "./ChatSidebar";

export default function Chat() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const sendMessage = useCallback(async (messageToSend) => {
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
      const res = await fetch(import.meta.env.VITE_API_URL || "http://localhost:3000/ask", {
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
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
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
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
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