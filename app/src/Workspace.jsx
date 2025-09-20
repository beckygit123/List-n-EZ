import React, { useState } from "react";
import { Route, Routes, Link, NavLink } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import RemoveBackgroundTool from "./RemoveBackgroundTool";

// Enhanced categories with more comprehensive data
const categories = {
  "🖥 Digital Add-Ons": [
    { name: "Mockup Generator (POD)", url: "https://github.com/bestony/mockup-generator", ai: true, tags: ["design", "print-on-demand"] },
    { name: "React T-Shirt Designer", url: "https://github.com/ainame/react-tshirt-design", ai: true, tags: ["clothing", "customization"] },
    { name: "T-shirt Creator (Canvas API)", url: "https://github.com/tsaylor/tshirt-creator", ai: false, tags: ["clothing", "canvas"] },
    { name: "Labelmaker (CSV → SVG)", url: "https://github.com/ducky64/labelmaker", ai: true, tags: ["labels", "automation"] },
    { name: "Blabel (Python Labels)", url: "https://github.com/Edinburgh-Genome-Foundry/blabel", ai: true, tags: ["python", "labels"] },
    { name: "SVG Label Maker", url: "https://github.com/flesch/svg-label-maker", ai: false, tags: ["svg", "labels"] },
    { name: "SVG Labels", url: "https://github.com/bhousel/svg-labels", ai: false, tags: ["svg", "graphics"] }
  ],

  "👗 Clothing & Apparel": [
    { name: "WeasyPrint (HTML/CSS → PDF)", url: "https://github.com/Kozea/WeasyPrint", ai: true, tags: ["pdf", "documentation"] },
    { name: "wkhtmltopdf (HTML → PDF CLI)", url: "https://github.com/wkhtmltopdf/wkhtmltopdf", ai: false, tags: ["pdf", "cli"] },
    { name: "WeasyPrint Samples", url: "https://github.com/CourtBouillon/weasyprint-samples", ai: false, tags: ["templates", "examples"] },
    { name: "Virtual Try-On System", url: "https://github.com/xthan/Virtual-Try-On", ai: true, tags: ["ai", "fashion"] },
    { name: "Clothing Size Calculator", url: "https://github.com/size-calculator/clothing-size", ai: true, tags: ["sizing", "utility"] }
  ],

  "🔌 Tech & Electronics": [
    { name: "Business Card Generator", url: "https://github.com/paulrouget/business-card", ai: false, tags: ["business", "cards"] },
    { name: "EnBizCard (QR / Digital Card)", url: "https://github.com/vishnuraghavb/EnBizCard", ai: true, tags: ["qr", "digital"] },
    { name: "QR Code Generator Pro", url: "https://github.com/soldair/node-qrcode", ai: true, tags: ["qr", "advanced"] },
    { name: "Manual Generator AI", url: "https://github.com/tech-docs/manual-generator", ai: true, tags: ["documentation", "ai"] }
  ],

  "🔧 Tools & DIY": [
    { name: "GsColorbook (Line Art Generator)", url: "https://github.com/gsethi2409/GsColorbook", ai: true, tags: ["art", "conversion"] },
    { name: "Coloring Book Creator", url: "https://github.com/codebyahmed/coloring-book-creator", ai: true, tags: ["art", "books"] },
    { name: "3D Model Viewer", url: "https://github.com/google/model-viewer", ai: false, tags: ["3d", "visualization"] },
    { name: "Assembly Guide Generator", url: "https://github.com/assembly-guide/generator", ai: true, tags: ["instructions", "automation"] }
  ],

  "🛍 Universal Products": [
    { name: "JSON Resume Builder", url: "https://github.com/jsonresume", ai: true, tags: ["resume", "professional"] },
    { name: "Resume CLI", url: "https://github.com/jsonresume/resume-cli", ai: false, tags: ["cli", "resume"] },
    { name: "LaTeX CV Collection", url: "https://github.com/jankapunkt/latexcv", ai: false, tags: ["latex", "cv"] },
    { name: "Gift Card Designer", url: "https://github.com/gift-card-designer/card-designer", ai: true, tags: ["gifts", "design"] },
    { name: "Certificate Generator", url: "https://github.com/certificate-generator/generator", ai: true, tags: ["certificates", "professional"] }
  ],

  "🛒 E-commerce Platforms": [
    { name: "Saleor (GraphQL Shop)", url: "https://github.com/saleor/saleor", ai: false, tags: ["ecommerce", "graphql"] },
    { name: "Bagisto (Laravel Shop)", url: "https://github.com/bagisto/bagisto", ai: false, tags: ["ecommerce", "laravel"] },
    { name: "OpenCart (PHP Shop)", url: "https://github.com/opencart/opencart", ai: false, tags: ["ecommerce", "php"] },
    { name: "AI Product Recommender", url: "https://github.com/product-recommender/ai-recommender", ai: true, tags: ["ai", "recommendations"] }
  ],

  "📦 Reseller Tools": [
    { name: "Shopify Product Importer", url: "https://github.com/shopify/product-importer", ai: true, tags: ["shopify", "import"] },
    { name: "eBay Listing Optimizer", url: "https://github.com/ebay/listing-optimizer", ai: true, tags: ["ebay", "optimization"] },
    { name: "Price Tracker Pro", url: "https://github.com/price-tracker/pro", ai: true, tags: ["pricing", "monitoring"] },
    { name: "Inventory Manager AI", url: "https://github.com/inventory-manager/ai", ai: true, tags: ["inventory", "ai"] },
    { name: "Cross-Platform Lister", url: "https://github.com/cross-platform/lister", ai: true, tags: ["automation", "listing"] }
  ],

  "📸 Image Tools": [
    { name: "AI Background Remover", internal: true, path: "/workspace/tool/remove-background", ai: true, tags: ["ai", "image-processing", "rembg"] }
  ]
};

// Enhanced draggable card with better styling
function DraggableCard({ item, aiIntensity, isDarkMode }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <Card className={`
        shadow-md hover:shadow-xl transition-all duration-300 cursor-move overflow-hidden
        ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}
        ${isHovered ? 'ring-2 ring-blue-400' : ''}
      `}>
        <CardContent className="p-4">
          {/* Header with AI badge and status indicator */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-base leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {item.name}
              </h3>
              <span className={`w-3 h-3 rounded-full ${item.internal ? 'bg-green-500' : 'bg-green-500'}`}></span>
            </div>
            {item.ai && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium"
              >
                AI x{aiIntensity}
              </motion.span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags?.map((tag, i) => (
              <span 
                key={i}
                className={`text-xs px-2 py-1 rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action button */}
          <Button 
            asChild 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium transition-all duration-200"
          >
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              Open Repository
            </a>
            {item.internal ? (
              <Link to={item.path}>
                Open Tool
              </Link>
            ) : (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                Open Repository
              </a>
            )}
          </Button>
        </CardContent>

        {/* Hover effect overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Enhanced drop zone with better feedback
function DropZone({ onDrop, children, isDarkMode }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <motion.div
      ref={drop}
      animate={{
        scale: isOver ? 1.02 : 1,
        borderColor: isOver ? '#3b82f6' : '#9ca3af'
      }}
      className={`
        border-2 border-dashed rounded-xl p-6 min-h-[200px] transition-all duration-300
        ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'}
        ${isOver ? 'bg-blue-50 border-blue-400 shadow-lg' : ''}
      `}
    >
      {children}
    </motion.div>
  );
}

// Enhanced category page with improved UX
function CategoryPage({ title, items, aiIntensity, setAiIntensity, isDarkMode, setIsDarkMode }) {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [showAiOnly, setShowAiOnly] = useState(false);

  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => !showAiOnly || item.ai)
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "ai") return (b.ai ? 1 : 0) - (a.ai ? 1 : 0);
      return 0;
    });

  const handleDrop = (item) => {
    if (!favorites.find((f) => f.name === item.name)) {
      setFavorites([...favorites, { ...item, addedAt: new Date() }]);
    }
  };

  const removeFavorite = (itemName) => {
    setFavorites(favorites.filter(f => f.name !== itemName));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {filteredItems.length} tools available
          </p>
        </motion.div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Search */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Search Tools
            </label>
            <Input
              type="text"
              placeholder={`Search in ${title}...`}
              className={`w-full ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* AI Intensity */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              AI Intensity Level
            </label>
            <Slider
              defaultValue={[aiIntensity]}
              max={5}
              min={1}
              step={1}
              onValueChange={(val) => setAiIntensity(val[0])}
              className="w-full"
            />
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter & Sort
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 rounded-md border text-sm ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="name">Sort by Name</option>
                <option value="ai">AI Tools First</option>
              </select>
              <button
                onClick={() => setShowAiOnly(!showAiOnly)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  showAiOnly
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                AI Only
              </button>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            ⭐ Your Favorites ({favorites.length})
          </h3>
          <DropZone onDrop={handleDrop} isDarkMode={isDarkMode}>
            {favorites.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📋</div>
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Drag tools here to save as favorites
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Build your personalized toolkit
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {favorites.map((fav, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`
                      p-3 rounded-lg border flex justify-between items-center
                      ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}
                    `}
                  >
                    <div>
                      <a
                        href={fav.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                      >
                        {fav.name}
                      </a>
                      {fav.ai && (
                        <span className="ml-2 text-xs text-green-500">AI</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFavorite(fav.name)}
                      className="text-red-400 hover:text-red-600 text-lg"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </DropZone>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            🛠️ Available Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredItems.map((item, i) => (
                <motion.div
                  key={`${item.name}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <DraggableCard 
                    item={item} 
                    aiIntensity={aiIntensity} 
                    isDarkMode={isDarkMode}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No tools found matching your search
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced main workspace component
export default function Workspace() {
  const [aiIntensity, setAiIntensity] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {/* Enhanced Navbar (now a sub-nav for the workspace) */}
          <nav className={`
            sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm
            ${isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}
            border-b shadow-sm
          `}>
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/workspace" className="flex items-center space-x-2">
                  <span className="text-2xl">🛍️</span>
                  <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    List'n'EZ
                  </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-1">
                  {Object.keys(categories).map((cat) => ( 
                    <NavLink
                      key={cat}
                      to={`/workspace/${cat.replace(/\s+/g, "-").toLowerCase()}`}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isDarkMode 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                      style={({ isActive }) => isActive ? { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' } : {}}
                    >
                      {cat}
                    </NavLink>
                  ))}
                </div>

                {/* Dark mode toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isDarkMode 
                      ? 'text-yellow-400 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </nav>

        {/* Routes */}
          <div className="flex-1">
            <Routes>
              {Object.entries(categories).map(([cat, items]) => (
                <Route
                  key={cat}
                  path={`/${cat.replace(/\s+/g, "-").toLowerCase()}`}
                  element={
                    <CategoryPage 
                      title={cat} 
                      items={items} 
                      aiIntensity={aiIntensity} 
                      setAiIntensity={setAiIntensity}
                      isDarkMode={isDarkMode}
                      setIsDarkMode={setIsDarkMode}
                    />
                  }
                />
              ))}
              <Route
                path="/" // This is now the index route for /workspace
                element={
                  <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
                    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="text-6xl mb-6">🛍️</div>
                        <h1 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          List'n'EZ Seller Workspace
                        </h1>
                        <p className={`text-xl leading-relaxed max-w-3xl mx-auto mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Your comprehensive toolkit for digital entrepreneurship. Browse GitHub-powered tools, 
                          templates, reseller resources, and AI-integrated solutions. Drag and drop your favorites, 
                          adjust AI intensity, and build your perfect workflow.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                          {[
                            { icon: "🤖", title: "AI-Powered", desc: "Smart automation with adjustable intensity" },
                            { icon: "🎯", title: "Drag & Drop", desc: "Intuitive favorites and organization" },
                            { icon: "🛠️", title: "Professional Tools", desc: "Curated GitHub repositories" }
                          ].map((feature, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + i * 0.1 }}
                              className={`
                                p-6 rounded-xl shadow-sm
                                ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                              `}
                            >
                              <div className="text-3xl mb-3">{feature.icon}</div>
                              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {feature.title}
                              </h3>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feature.desc}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
      </div>
    </DndProvider>
  );
}