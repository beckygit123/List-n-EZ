import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Camera, Check, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileCamera = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const connectSocketAndWebRTC = useCallback(() => {
    if (!roomId) {
      setError("Connection failed: No Room ID provided.");
      return;
    }

    const socketUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000'
      : window.location.origin;
    const socket = io(socketUrl); // Connect to the server
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Mobile connected to socket server');
      socket.emit('join-room', roomId);
    });

    socket.on('peer-joined', async () => {
      console.log('Desktop peer joined, creating WebRTC offer...');
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // Public STUN server
      });
      peerConnectionRef.current = pc;

      // Add local stream tracks to the connection
      if (stream) {
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { roomId, candidate: event.candidate });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer });
    });

    socket.on('answer', async (answer) => {
      console.log('Received answer from desktop peer');
      if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });
    
    socket.on('ice-candidate', (candidate) => {
      if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('disconnect', () => {
      setError("Disconnected from server. Please re-scan the QR code.");
      stopCamera();
    });

  }, [roomId, stream]);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Prefer the rear camera
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera on mobile:", err);
      setError("Could not access the camera. Please grant permission in your browser settings.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
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
      
      // Send the captured image to the desktop via Socket.IO
      if (socketRef.current) {
        socketRef.current.emit('image-captured', { roomId, image: imageDataUrl });
      }

      stopCamera();
    }
  }, [stopCamera, roomId]);

  useEffect(() => {
    startCamera();
    // Cleanup on component unmount
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Connect WebRTC once the camera stream is ready
  useEffect(() => {
    if (stream) {
      connectSocketAndWebRTC();
    }
  }, [stream, connectSocketAndWebRTC]);


  if (error) {
    return (
      <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <WifiOff className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (capturedImage) {
    return (
      <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center">
        <Check className="h-24 w-24 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold">Image Captured!</h1>
        <p className="text-lg">You can now return to your desktop.</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black relative">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <Button onClick={captureImage} size="lg" className="rounded-full w-24 h-24 bg-white/20 backdrop-blur-sm border-4 border-white text-white hover:bg-white/30">
          <Camera size={48} />
        </Button>
      </div>
    </div>
  );
};

export default MobileCamera;
