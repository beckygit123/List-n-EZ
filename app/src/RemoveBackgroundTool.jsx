import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function RemoveBackgroundTool({ isDarkMode }) {
    const [originalImage, setOriginalImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setOriginalImage(URL.createObjectURL(selectedFile));
            setProcessedImage(null);
            setError(null);
        }
    };

    const processImage = useCallback(async () => {
        if (!file) return;

        setIsLoading(true);
        setProcessedImage(null);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:3000/tools/remove-background', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const imageBlob = await response.blob();
            setProcessedImage(URL.createObjectURL(imageBlob));

        } catch (err) {
            console.error('Failed to process image:', err);
            setError('Failed to process image. Make sure the backend is running and `rembg` is installed.');
        } finally {
            setIsLoading(false);
        }
    }, [file]);

    return (
        <div className={`p-6 max-w-7xl mx-auto ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold mb-2">📸 AI Background Remover</h1>
                <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Upload a product photo to automatically remove the background.
                </p>
            </motion.div>

            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
                            1. Upload Your Image
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            className={`w-full text-sm rounded-lg border cursor-pointer
                                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 file:bg-gray-600 file:text-white' : 'border-gray-300 file:bg-gray-100'}
                                file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:font-semibold
                            `}
                        />
                        <p className="text-xs text-gray-500 mt-1">PNG or JPG files are accepted.</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            onClick={processImage}
                            disabled={!originalImage || isLoading}
                            className="w-full md:w-auto bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:cursor-not-allowed text-lg"
                        >
                            {isLoading ? 'Processing...' : '2. Remove Background'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-100 text-red-800 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">Original</h3>
                        <div className={`aspect-square rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            {originalImage ? <img src={originalImage} alt="Original" className="max-h-full max-w-full object-contain rounded-lg" /> : <p className="text-gray-400">Your image will appear here</p>}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Result</h3>
                        <div className={`aspect-square rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            {isLoading && <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>}
                            {processedImage && !isLoading && <img src={processedImage} alt="Processed" className="max-h-full max-w-full object-contain rounded-lg" />}
                            {!processedImage && !isLoading && <p className="text-gray-400">The result will appear here</p>}
                        </div>
                        {processedImage && <a href={processedImage} download="background-removed.png" className="mt-4 inline-block w-full text-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">Download Result</a>}
                    </div>
                </div>
            </div>
        </div>
    );
}
