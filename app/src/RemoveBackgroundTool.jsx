import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RemoveBackgroundTool({ isDarkMode }) {
    const [originalImage, setOriginalImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);

    // Cleanup object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (originalImage && originalImage.startsWith('blob:')) {
                URL.revokeObjectURL(originalImage);
            }
            if (processedImage && processedImage.startsWith('blob:')) {
                URL.revokeObjectURL(processedImage);
            }
        };
    }, [originalImage, processedImage]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            console.log('File selected:', selectedFile.name, selectedFile.type, selectedFile.size);
            
            // Validate file type
            if (!selectedFile.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }
            
            // Validate file size (max 5MB for better performance)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size too large. Please select an image under 5MB');
                return;
            }
            
            setFile(selectedFile);
            setError(null);
            setProcessedImage(null);
            
            // Use FileReader with better error handling
            const reader = new FileReader();
            
            reader.onload = function(event) {
                console.log('FileReader loaded successfully');
                const dataURL = event.target.result;
                setIsImageLoading(false);
                setOriginalImage(dataURL);
            };
            
            reader.onerror = function(event) {
                console.error('FileReader error:', event.target.error);
                setIsImageLoading(false);
                setError('Failed to read the image file. Please try a different image.');
            };
            
            reader.onabort = function() {
                console.error('FileReader aborted');
                setIsImageLoading(false);
                setError('File reading was cancelled.');
            };
            
            // Start loading
            setIsImageLoading(true);
            console.log('Starting to read file...');
            
            // Read as data URL (base64)
            reader.readAsDataURL(selectedFile);
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
            const apiUrl = window.location.hostname === 'localhost' 
              ? 'http://localhost:3000/api/remove-background'
              : `${window.location.origin}/api/remove-background`;
            
            const response = await fetch(apiUrl, {
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
                            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                            onChange={handleFileChange}
                            className={`w-full text-sm rounded-lg border cursor-pointer
                                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 file:bg-gray-600 file:text-white' : 'border-gray-300 file:bg-gray-100'}
                                file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:font-semibold
                            `}
                        />
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, or WebP files are accepted.</p>
                        {file && (
                            <p className="text-xs text-green-600 mt-1">✅ File loaded: {file.name} ({Math.round(file.size/1024)}KB)</p>
                        )}
                        {originalImage && (
                            <p className="text-xs text-blue-600 mt-1">🔗 Image data: {originalImage.substring(0, 30)}...</p>
                        )}
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
                        <div className={`aspect-square rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                            {isImageLoading ? (
                                <div className="text-center">
                                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                    <p className="text-gray-400 text-sm">Loading image...</p>
                                </div>
                            ) : originalImage ? (
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <img 
                                        src={originalImage} 
                                        alt="Uploaded image" 
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        onLoad={() => {
                                            console.log('✅ Image displayed successfully');
                                        }}
                                        onError={(e) => {
                                            console.error('❌ Image display error:', e.target.src);
                                            setError('Image display failed. Try a different file format.');
                                            setOriginalImage(null);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="text-6xl mb-4">📁</div>
                                    <p className="text-gray-500">Choose an image file</p>
                                    <p className="text-gray-400 text-sm mt-1">JPG, PNG, GIF up to 5MB</p>
                                </div>
                            )}
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
