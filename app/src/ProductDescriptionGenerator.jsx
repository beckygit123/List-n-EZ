import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

const ProductDescriptionGenerator = ({ aiIntensity }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setIsLoading(true);
    setAiResponse("");
    setError(null);
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, aiIntensity }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.analysis);
    } catch (err) {
      console.error("Error sending image to AI:", err);
      setError("Failed to get analysis from AI. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-6"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Product Description Generator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Upload a product image to get an AI-generated title and description.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Image Upload */}
          <div className="flex flex-col items-center">
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center">
                  {image ? (
                    <img src={image} alt="Uploaded product" className="max-h-48 rounded-lg" />
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Upload an image</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button asChild className="w-full mt-4">
                  <label htmlFor="image-upload">Choose File</label>
                </Button>
              </CardContent>
            </Card>
            <Button onClick={handleGenerate} size="lg" className="mt-4 bg-green-600 hover:bg-green-700 text-white" disabled={!image || isLoading}>
              <Zap className="mr-2 h-5 w-5" />
              {isLoading ? 'Generating...' : 'Generate Description'}
            </Button>
          </div>

          {/* Right Column: AI Response */}
          <div className="flex flex-col justify-between min-h-[250px]">
            <div className="flex-grow">
              {aiResponse ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-sm dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border dark:border-gray-700">
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </motion.div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <RefreshCw className="h-10 w-10 text-pink-500 animate-spin mb-4" />
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">AI is generating content...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                  <FileText className="h-10 w-10 mb-4" />
                  <p className="font-semibold">AI-generated content will appear here.</p>
                </div>
              )}
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDescriptionGenerator;
