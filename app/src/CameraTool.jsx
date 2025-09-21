import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as QRCodeReact from 'qrcode.react';
const QRCode = QRCodeReact.default;
import io from 'socket.io-client';
import { Camera, X, Upload, Zap, RefreshCw, FileText, Smartphone, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

const CameraTool = ({ aiIntensity }) => {
  const [cameraMode, setCameraMode] = useState('selection'); // 'selection', 'local', 'remote'
  const [roomId, setRoomId] = useState(null);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const setupRemoteCamera = () => {
    const newRoomId = `listnez-room-${Date.now()}`;
    setRoomId(newRoomId);
    setCameraMode('remote');

    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Desktop connected to socket server');
      socket.emit('join-room', newRoomId);
    });

    socket.on('offer', async (offer) => {
      console.log('Received offer from mobile peer');
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      peerConnectionRef.current = pc;

      pc.ontrack = (event) => {
        console.log('Received remote track');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setIsPeerConnected(true);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { roomId: newRoomId, candidate: event.candidate });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { roomId: newRoomId, answer });
    });

    socket.on('ice-candidate', (candidate) => {
      if (pc && pc.signalingState !== 'closed') {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
    
    socket.on('image-captured', (image) => {
      console.log('Image received from mobile!');
      setCapturedImage(image);
      setCameraMode('selection'); // Go back to selection screen
      cleanupRTC();
    });
  };

  const cleanupRTC = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRoomId(null);
    setIsPeerConnected(false);
  };

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
      setCapturedImage(null);
      setAiResponse("");
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please ensure you have a camera connected and have granted permission.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  }, [stopCamera]);

  const handleSendToAI = async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    setAiResponse("");
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: capturedImage, aiIntensity }),
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
  
  const reset = () => {
    setCapturedImage(null);
    setAiResponse("");
    setError(null);
    setCameraMode('selection');
    stopCamera();
    cleanupRTC();
  };

  const showLocalCamera = cameraMode === 'local' && !capturedImage;
  const showSelection = cameraMode === 'selection' && !capturedImage;
  const showRemote = cameraMode === 'remote' && !capturedImage;

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-6"
      >
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Camera & AI Analyzer</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Capture a product image and get an AI-generated title and description.</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {showSelection && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Choose Your Camera</h2>
            <p className="text-md text-gray-500 dark:text-gray-400 mb-8">
              For the best experience with "Use Phone Camera", ensure your phone and computer<br/>are on the same Wi-Fi network.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Button onClick={() => { setCameraMode('local'); startCamera(); }} size="lg" className="w-64 h-24 text-lg">
                <Camera className="mr-3 h-8 w-8" /> Use Computer<br/>Camera
              </Button>
              <Button variant="outline" onClick={setupRemoteCamera} size="lg" className="w-64 h-24 text-lg">
                <Smartphone className="mr-3 h-8 w-8" /> Use Phone<br/>Camera
              </Button>
            </div>
          </motion.div>
        )}

        {showRemote && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-2 dark:text-white">Scan with your Phone</h2>
              <p className="text-md text-gray-500 dark:text-gray-400 mb-6">Open your phone's camera and point it at the QR code below.</p>
              <div className="relative bg-white p-4 rounded-lg">
                <QRCode value={`${window.location.origin}/mobile-camera?roomId=${roomId}`} size={192} />
                <div className={`absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300 ${isPeerConnected ? 'opacity-0' : 'opacity-100'}`}>
                  <Wifi className="h-12 w-12 text-gray-400 animate-pulse" />
                  <p className="mt-2 font-semibold text-gray-600">Waiting for connection...</p>
                </div>
              </div>
              <Button variant="ghost" onClick={reset} className="mt-6">
                Cancel
              </Button>
           </motion.div>
        )}

        <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden transition-all duration-300 ${showLocalCamera || (showRemote && isPeerConnected) ? 'block' : 'hidden'}`}>
          {/* Local Camera Video */}
          <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${showLocalCamera ? 'block' : 'hidden'}`}></video>
          
          {/* Remote Camera Video */}
          <video ref={remoteVideoRef} autoPlay playsInline className={`w-full h-full object-cover ${showRemote && isPeerConnected ? 'block' : 'hidden'}`}></video>

          <div className="absolute top-4 right-4">
            {showRemote && (
              isPeerConnected ? (
                <div className="flex items-center gap-2 bg-green-100/80 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                  <Wifi className="h-4 w-4" /> Connected
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-yellow-100/80 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                  <WifiOff className="h-4 w-4" /> Waiting...
                </div>
              )
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Button onClick={captureImage} size="lg" className={`rounded-full w-20 h-20 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 ${showLocalCamera ? 'flex' : 'hidden'}`}>
              <Camera size={32} />
            </Button>
          </div>
        </div>

        {capturedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row gap-6 mt-6">
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Captured Image</h3>
              <img src={capturedImage} alt="Captured product" className="rounded-lg shadow-md w-full" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">AI Analysis</h3>
              <div className="flex-grow bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50 prose dark:prose-invert max-w-none">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="animate-spin h-8 w-8 text-pink-500" />
                    <p className="ml-3 text-lg">Analyzing with AI...</p>
                  </div>
                ) : (
                  <ReactMarkdown>{aiResponse || "Click 'Generate' to get AI analysis."}</ReactMarkdown>
                )}
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Button onClick={handleSendToAI} disabled={isLoading} size="lg" className="flex-1 bg-pink-600 hover:bg-pink-700 text-white">
                  <Zap className="mr-2 h-5 w-5" />
                  {isLoading ? 'Generating...' : 'Generate'}
                </Button>
                <Button onClick={reset} variant="outline" size="lg">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CameraTool;