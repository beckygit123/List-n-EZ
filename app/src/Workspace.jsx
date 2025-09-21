import React, { useState } from "react";
import { Route, Routes, NavLink } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import RemoveBackgroundTool from "./RemoveBackgroundTool";
import CameraTool from "./CameraTool";
import ProductDescriptionGenerator from "./ProductDescriptionGenerator";
import { LayoutGrid, Star, Search, Sliders, Bot, Package, Palette, Camera, Store, ShoppingCart, Tag, Video } from 'lucide-react';

const categories = {
  "Digital Add-Ons": {
    icon: Palette,
    items: [
      { name: "Mockup Generator (POD)", url: "https://github.com/bestony/mockup-generator", ai: true, tags: ["design", "print-on-demand"] },
      { name: "React T-Shirt Designer", url: "https://github.com/ainame/react-tshirt-design", ai: true, tags: ["clothing", "customization"] },
    ]
  },
  "Clothing & Apparel": {
    icon: Package,
    items: [
        { name: "Virtual Try-On System", url: "https://github.com/xthan/Virtual-Try-On", ai: true, tags: ["ai", "fashion"] },
        { name: "Clothing Size Calculator", url: "https://github.com/size-calculator/clothing-size", ai: true, tags: ["sizing", "utility"] }
    ]
  },
  "Image Tools": {
    icon: Camera,
    items: [
        { name: "AI Background Remover", internal: true, path: "/workspace/tool/remove-background", ai: true, tags: ["ai", "image-processing", "rembg"] },
        { name: "Product Camera", internal: true, path: "/workspace/tool/camera", ai: true, tags: ["capture", "product"] }
    ]
  },
  "E-commerce Platforms": {
    icon: Store,
    items: [
        { name: "Saleor (GraphQL Shop)", url: "https://github.com/saleor/saleor", ai: false, tags: ["ecommerce", "graphql"] },
        { name: "AI Product Recommender", url: "https://github.com/product-recommender/ai-recommender", ai: true, tags: ["ai", "recommendations"] }
    ]
  },
  "Reseller Tools": {
    icon: Tag,
    items: [
        { name: "Shopify Product Importer", url: "https://github.com/shopify/product-importer", ai: true, tags: ["shopify", "import"] },
        { name: "eBay Listing Optimizer", url: "https://github.com/ebay/listing-optimizer", ai: true, tags: ["ebay", "optimization"] },
        { name: "AI Product Description Generator", internal: true, path: "/workspace/tool/product-description-generator", ai: true, tags: ["ai", "text-generation", "writing"] },
    ]
  },
};

function DraggableCard({ item, aiIntensity }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <motion.div
      ref={drag}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="relative cursor-move"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card className="overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-lg border-gray-200/80 dark:border-gray-800/80">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-base leading-tight text-gray-800 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
              {item.name}
            </h3>
            {item.ai && (
              <motion.span
                className="bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"
              >
                <Bot size={12} /> AI
              </motion.span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags?.map((tag, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {tag}
              </span>
            ))}
          </div>

          <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-pink-50 dark:group-hover:bg-gray-700/50 group-hover:text-pink-600 dark:group-hover:text-pink-400 group-hover:border-pink-300 dark:group-hover:border-pink-500/50 transition-all">
            {item.internal ? (
              <NavLink to={item.path}>Open Tool</NavLink>
            ) : (
              <a href={item.url} target="_blank" rel="noopener noreferrer">Open Repo</a>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DropZone({ onDrop, children }) {
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
        borderColor: isOver ? 'rgb(219 39 119)' : 'hsl(var(--border))'
      }}
      className="border-2 border-dashed rounded-xl p-6 min-h-[200px] transition-all duration-300 bg-gray-50/50 dark:bg-gray-800/20"
    >
      {children}
    </motion.div>
  );
}

function CategoryPage({ title, items, aiIntensity, setAiIntensity }) {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showAiOnly, setShowAiOnly] = useState(false);

  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => !showAiOnly || item.ai);

  const handleDrop = (item) => {
    if (!favorites.find((f) => f.name === item.name)) {
      setFavorites([...favorites, { ...item, addedAt: new Date() }]);
    }
  };

  const removeFavorite = (itemName) => {
    setFavorites(favorites.filter(f => f.name !== itemName));
  };

  return (
    <div className="p-4 sm:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">{filteredItems.length} tools available</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 items-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder={`Search in ${title}...`}
            className="w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Sliders size={16} /> AI Intensity
          </label>
          <Slider
            defaultValue={[aiIntensity]}
            max={5}
            min={1}
            step={1}
            onValueChange={(val) => setAiIntensity(val[0])}
          />
        </div>

        <div className="flex gap-2 justify-self-start lg:justify-self-end">
          <Button
            variant={showAiOnly ? "default" : "outline"}
            onClick={() => setShowAiOnly(!showAiOnly)}
            className={showAiOnly ? "bg-pink-600 hover:bg-pink-700 text-white" : ""}
          >
            <Bot size={16} className="mr-2" /> AI Only
          </Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <Star className="text-yellow-400" /> Your Favorites ({favorites.length})
        </h3>
        <DropZone onDrop={handleDrop}>
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✨</div>
              <p className="text-lg text-gray-500 dark:text-gray-400">Drag tools here to build your toolkit</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {favorites.map((fav, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-lg border flex justify-between items-center bg-white dark:bg-gray-800"
                >
                  <a href={fav.url} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-pink-600 hover:underline">
                    {fav.name}
                  </a>
                  <button onClick={() => removeFavorite(fav.name)} className="text-red-400 hover:text-red-600 text-lg">×</button>
                </motion.div>
              ))}
            </div>
          )}
        </DropZone>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Available Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredItems.map((item, i) => (
              <DraggableCard key={`${item.name}-${i}`} item={item} aiIntensity={aiIntensity} />
            ))}
          </AnimatePresence>
        </div>
        {filteredItems.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-6xl mb-4">🤷‍♀️</div>
            <p className="text-lg text-gray-500 dark:text-gray-400">No tools found. Try a different search!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function Workspace() {
  const [aiIntensity, setAiIntensity] = useState(3);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full">
        <nav className="w-64 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-2">
          <h2 className="text-lg font-semibold mb-2 px-2 text-gray-900 dark:text-white">Tool Categories</h2>
          {Object.entries(categories).map(([cat, { icon: Icon }]) => (
            <NavLink
              key={cat}
              to={`/workspace/${cat.replace(/\s+/g, "-").toLowerCase()}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon size={20} />
              <span>{cat}</span>
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto">
          <Routes>
            {Object.entries(categories).map(([cat, { items }]) => (
              <Route
                key={cat}
                path={`/${cat.replace(/\s+/g, "-").toLowerCase()}`}
                element={
                  <CategoryPage
                    title={cat}
                    items={items}
                    aiIntensity={aiIntensity}
                    setAiIntensity={setAiIntensity}
                  />
                }
              />
            ))}
            <Route path="/tool/remove-background" element={<RemoveBackgroundTool aiIntensity={aiIntensity} />} />
            <Route path="/tool/camera" element={<CameraTool aiIntensity={aiIntensity} />} />
            <Route path="/tool/product-description-generator" element={<ProductDescriptionGenerator aiIntensity={aiIntensity} />} />
            <Route
              path="/"
              element={
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="mx-auto bg-pink-100 dark:bg-pink-900/50 rounded-full h-24 w-24 flex items-center justify-center mb-6">
                      <LayoutGrid className="h-12 w-12 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">List'n'<span className="text-pink-600 dark:text-pink-400">EZ</span> Workspace</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      Select a category to browse powerful tools for digital entrepreneurship, from AI-powered helpers to design assets.
                    </p>
                  </motion.div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </DndProvider>
  );
}