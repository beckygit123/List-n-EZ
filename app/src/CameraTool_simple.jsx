import React, { useState } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

const CameraTool = ({ aiIntensity }) => {
  console.log('CameraTool component is mounting');
  
  const [showQR, setShowQR] = useState(false);
  const [roomId] = useState(`listnez-room-${Date.now()}`);

  const handleShowQR = () => {
    console.log('Show QR button clicked');
    setShowQR(true);
  };

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Camera & AI Analyzer</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Capture a product image and get an AI-generated title and description.</p>
        </div>

        {!showQR && (
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Choose Your Camera</h2>
            <Button onClick={handleShowQR} size="lg" className="w-64 h-24 text-lg">
              <Smartphone className="mr-3 h-8 w-8" /> Use Phone Camera
            </Button>
          </div>
        )}

        {showQR && (
          <div className="text-center p-8 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2 dark:text-white">Scan with your Phone</h2>
            <p className="text-md text-gray-500 dark:text-gray-400 mb-6">Open your phone's camera and point it at the QR code below.</p>
            <div className="bg-white p-4 rounded-lg">
              <QRCode 
                value={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/mobile-camera?roomId=${roomId}`} 
                size={192} 
              />
            </div>
            <Button variant="ghost" onClick={() => setShowQR(false)} className="mt-6">
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraTool;