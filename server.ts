import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.use(express.json());

  // API Routes
  app.post("/api/explain", async (req, res) => {
    try {
      const { state, tape, headIndex, currentRule, nextAction } = req.body;
      
      const prompt = `
        Explica este paso de una simulación de Máquina de Turing en español, utilizando terminología formal de la teoría de autómatas.
        Estado Actual: ${state}
        Snapshot de la cinta: ...${tape.slice(Math.max(0, headIndex - 2), headIndex + 3).join('')}...
        Posición del cabezal: ${headIndex} (símbolo: ${tape[headIndex]})
        Regla Activa: ${JSON.stringify(currentRule)}
        Próxima Acción: ${nextAction}
        
        Proporciona una explicación concisa y educativa (máximo 2 líneas) sobre la transición, mencionando el cambio de estado, el símbolo escrito y el movimiento del cabezal.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash-latest",
        contents: prompt,
      });

      res.json({ explanation: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate-exercise", async (req, res) => {
    try {
      const { difficulty } = req.body;
      const prompt = `Genera un ejercicio de Máquina de Turing para un estudiante de nivel ${difficulty} en español.
      Incluye un título, una descripción (el objetivo) y un ejemplo de entrada/salida esperado.
      Devuelve la respuesta en formato JSON: { "title": "...", "description": "...", "target": "..." }`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash-latest",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
