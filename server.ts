import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Lazy initialization of Gemini API client
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API Routes FIRST
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      
      if (!ai) {
        // Gracious fallback if no real API Key is configured in Secrets
        return res.json({
          reply: "Yo! Just a heads-up: your **GEMINI_API_KEY** is not configured yet in standard secrets (Settings panel). Let's set it up later!\n\nIn the meantime, the absolute university staple is the BongVerse **SHONALU washed oversized Tee** (৳1450) styled with the loose stone-grey **BRUTALIST Cargo Pants** (৳2200). Comfortable, heavyweight, and perfect for BRAC, BUET, or DU campus runs! Let me know if you want sizing advice. ⚡"
        });
      }

      const systemInstruction = `You are the BongVerse AI Fashion Assistant, a premium streetwear stylist specifically tailoring lookbooks for university and college students in Bangladesh (e.g., DU, BUET, BRAC, NSU, IUT, AIUB).
Your mood is cool, friendly, knowledgeable, and respectful. You speak a natural, stylish blend of Bengali and English (Banglish) occasionally - reflecting how modern youths converse!
Provide excellent sizing tips, fabric insights, and outfits matching their agenda (campus walk, peer exams, coffee, or family events).

Highlight the BongVerse core street collection details:
1. BongVerse Heavy "SHONALU" Tee - washed black heavy 260GSM, golden floral print on chest. (৳1450)
2. "CHHAYANAUT" Utility Field Shirt - sage/olive green rich linen cargo pockets. (৳1850)
3. "BRUTALIST" Relaxed Cargo Pants - rugged stone washed sand canvas, multi bellows. (৳2200)
4. "DUKHEE" Campus Hoodie - heavy 400GSM terry charcoal with minimal rebellious poet embroidery. (৳2600)

Recommend L / XL sizes for high oversized drop-shoulder look if height > 5'8", and S / M for compact forms. Keep responses beautifully structured using Markdown bullets and bold highlights. Keep replies around 100-150 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: history || prompt }
        ],
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });

      const reply = response.text || "Bro, connection ektu slow. Can you say that again?";
      res.json({ reply });
    } catch (err: any) {
      console.error("Gemini controller error:", err);
      res.status(500).json({ error: "Uplink to styling database failed.", details: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BongVerse Streetwear server running on port ${PORT}`);
  });
}

startServer();
