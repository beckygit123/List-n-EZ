import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const upload = multer();
app.use(bodyParser.json());

// Enable CORS for frontend requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = "You are LystynZ-Agent, an AI assistant specialized in helping store owners and resellers succeed. Provide expert advice on reselling strategies, product sourcing, pricing, marketing, and business optimization. Be helpful, professional, and focused on practical solutions.";
    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

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

// Route for background removal tool
app.post('/tools/remove-background', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // For now, return the original image (placeholder until rembg is installed)
  res.setHeader('Content-Type', req.file.mimetype);
  res.send(req.file.buffer);
});

app.listen(3000, () => console.log("✅ Backend API running on http://localhost:3000"));

// Add route for Chrome DevTools app-specific information
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({
    "name": "LystynZ-Agent",
    "version": "1.0.0",
    "description": "AI assistant for reselling success."
  });
});