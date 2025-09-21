import { motion } from "framer-motion";
import { Zap, Lightbulb, BarChart2 } from 'lucide-react';

const quickPrompts = [
  "Write a product description for a vintage leather jacket",
  "What's a good pricing strategy for electronics on eBay?",
  "How should I respond to a customer complaint about shipping?",
  "Optimize this product title for better SEO",
];

export default function ChatSidebar({ onPromptClick, conversationHistory }) {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Zap size={20} className="text-pink-500" />
          Quick Prompts
        </h3>
        <div className="space-y-2">
          {quickPrompts.map((prompt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPromptClick(prompt)}
              className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700/50 hover:bg-pink-50 dark:hover:bg-pink-900/30 border border-gray-200 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-500/30 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Lightbulb size={20} className="text-yellow-500" />
          Pro Tips
        </h3>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2"><span className="mt-0.5">🎯</span>Be specific about your product.</li>
          <li className="flex items-start gap-2"><span className="mt-0.5">📊</span>Ask for pricing strategies.</li>
          <li className="flex items-start gap-2"><span className="mt-0.5">🔍</span>Request SEO keywords.</li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 mt-auto"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <BarChart2 size={20} className="text-green-500" />
          Session Stats
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">User Messages:</span>
            <span className="font-semibold text-pink-600 dark:text-pink-400">
              {conversationHistory.filter(msg => msg.type === 'user').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">AI Responses:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {conversationHistory.filter(msg => msg.type === 'ai' && msg.message).length}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}