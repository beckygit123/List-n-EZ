import { motion } from "framer-motion";

const quickPrompts = [
  "Write a product description for a vintage leather jacket",
  "What's a good pricing strategy for electronics on eBay?",
  "How should I respond to a customer complaint about shipping?",
  "Optimize this product title for better SEO",
  "Create care instructions for clothing items",
  "Generate a thank you note for customers"
];

export default function ChatSidebar({ onPromptClick, conversationHistory }) {
  return (
    <div className="space-y-6">
      {/* Quick Prompts */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="mr-2">⚡</span>
          Quick Prompts
        </h3>
        <div className="space-y-2">
          {quickPrompts.map((prompt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPromptClick(prompt)}
              className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg transition-all duration-200"
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100"
      >
        <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
          <span className="mr-2">💡</span>
          Pro Tips
        </h3>
        <ul className="space-y-3 text-sm text-green-700">
          <li className="flex items-start"><span className="mr-2 mt-0.5">🎯</span>Be specific about your product type and target audience</li>
          <li className="flex items-start"><span className="mr-2 mt-0.5">📊</span>Ask for pricing strategies based on your market research</li>
          <li className="flex items-start"><span className="mr-2 mt-0.5">🔍</span>Request SEO keywords for better product visibility</li>
          <li className="flex items-start"><span className="mr-2 mt-0.5">💬</span>Get help with customer service templates</li>
        </ul>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="mr-2">📈</span>
          Session Stats
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Messages sent:</span>
            <span className="font-semibold text-blue-600">
              {conversationHistory.filter(msg => msg.type === 'user').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">AI responses:</span>
            <span className="font-semibold text-green-600">
              {conversationHistory.filter(msg => msg.type === 'ai' && msg.message).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Session active:</span>
            <span className="font-semibold text-indigo-600">
              {conversationHistory.length > 0 ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}