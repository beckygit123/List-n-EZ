import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServer } from "http";
import { Server } from "socket.io";
import { removeBackground } from "@imgly/background-removal-node";
import { Blob } from "buffer";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for simplicity in development
    methods: ["GET", "POST"]
  }
});
const upload = multer();
// Increase payload size limit for base64 images
app.use(bodyParser.json({ limit: '10mb' }));

// Enable CORS for frontend requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Socket.IO signaling for WebRTC
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Event to join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    // Notify the other user in the room (if any) that a peer has joined
    socket.to(roomId).emit('peer-joined');
  });

  // Forwarding WebRTC offers
  socket.on('offer', (data) => {
    console.log(`Forwarding offer from ${socket.id} to room ${data.roomId}`);
    socket.to(data.roomId).emit('offer', data.offer);
  });

  // Forwarding WebRTC answers
  socket.on('answer', (data) => {
    console.log(`Forwarding answer from ${socket.id} to room ${data.roomId}`);
    socket.to(data.roomId).emit('answer', data.answer);
  });

  // Forwarding ICE candidates
  socket.on('ice-candidate', (data) => {
    // console.log(`Forwarding ICE candidate from ${socket.id} to room ${data.roomId}`);
    socket.to(data.roomId).emit('ice-candidate', data.candidate);
  });
  
  // Forwarding the captured image from mobile to desktop
  socket.on('image-captured', (data) => {
    console.log(`Forwarding image from mobile in room ${data.roomId}`);
    socket.to(data.roomId).emit('image-captured', data.image);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


app.post("/api/ask", async (req, res) => {
  const { prompt, aiChoice } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let fullPrompt = prompt;
    if (aiChoice === 'agent') {
      const systemPrompt = "You are List'n'EZ, an AI assistant specialized in helping store owners and resellers succeed. Provide expert advice on reselling strategies, product sourcing, pricing, marketing, and business optimization. Be helpful, professional, and focused on practical solutions.";
      fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;
    }
    
    const result = await model.generateContentStream(fullPrompt);

    res.setHeader('Content-Type', 'text/plain');

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }

    res.end();

  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    res.status(500).json({ error: "Failed to get response from AI agent" });
  }
});

// New route for image analysis
app.post("/api/analyze-image", async (req, res) => {
  const { image, aiIntensity } = req.body;

  if (!image) {
    return res.status(400).json({ error: "No image data provided." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let imagePrompt;
    switch (aiIntensity) {
      case 1:
        imagePrompt = "Generate a concise and factual product title and a short, one-paragraph description.";
        break;
      case 2:
        imagePrompt = "Generate a standard product title and a brief description highlighting key features.";
        break;
      case 4:
        imagePrompt = "Generate a creative and engaging product title and a detailed, persuasive description using multiple paragraphs.";
        break;
      case 5:
        imagePrompt = "Generate a highly imaginative and evocative product title and a long, narrative-style description that tells a story about the product. Use markdown for formatting.";
        break;
      case 3:
      default:
        imagePrompt = `Analyze this product image. Based on what you see, generate a compelling and SEO-friendly product title and a detailed product description. The title should be concise and attractive. The description should be a few paragraphs long, highlighting key features, materials, potential uses, and style. Format the output as follows:\n\n**Title:** [Your Generated Title]\n\n**Description:**\n[Your Generated Description]`;
        break;
    }

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/(png|jpeg);base64,/, "");

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
      },
    };

    const result = await model.generateContent([imagePrompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    res.json({ analysis: text });

  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    res.status(500).json({ error: "Failed to analyze image with AI" });
  }
});

app.post('/api/remove-background', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  try {
    const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    const processedImageBlob = await removeBackground(imageBlob);
    const buffer = Buffer.from(await processedImageBlob.arrayBuffer());
    
    res.writeHead(200, {
      'Content-Type': processedImageBlob.type,
      'Content-Length': buffer.length
    });
    res.end(buffer);

  } catch (error) {
    console.error('Background removal error:', error);
    res.status(500).send('Failed to process image.');
  }
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Add route for Chrome DevTools app-specific information
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({
    "name": "LystynZ-Agent",
    "version": "1.0.0",
    "description": "AI assistant for reselling success."
  });
});
