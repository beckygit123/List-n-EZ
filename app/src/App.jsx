import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Chat from './Chat.jsx'
import Workspace from './Workspace.jsx'

function App() {
  const location = useLocation();
  const activeTab = location.pathname.startsWith('/workspace') ? 'workspace' : 'chat';

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main Navigation */}
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">🛍️ LystynZ-Agent</h1>
          <div className="flex gap-4">
            <Link
              to="/"
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'chat' 
                  ? 'bg-blue-800 text-white' 
                  : 'bg-blue-500 hover:bg-blue-700'
              }`}
            >
              🤖 AI Assistant
            </Link>
            <Link
              to="/workspace"
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'workspace' 
                  ? 'bg-blue-800 text-white' 
                  : 'bg-blue-500 hover:bg-blue-700'
              }`}
            >
              🛠️ Tools Workspace
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/workspace/*" element={<Workspace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App