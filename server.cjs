var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_genai = require("@google/genai");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  const ai = new import_genai.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
  app.use(import_express.default.json());
  app.post("/api/explain", async (req, res) => {
    try {
      const { state, tape, headIndex, currentRule, nextAction } = req.body;
      const prompt = `
        Explica este paso de una simulaci\xF3n de M\xE1quina de Turing en espa\xF1ol, utilizando terminolog\xEDa formal de la teor\xEDa de aut\xF3matas.
        Estado Actual: ${state}
        Snapshot de la cinta: ...${tape.slice(Math.max(0, headIndex - 2), headIndex + 3).join("")}...
        Posici\xF3n del cabezal: ${headIndex} (s\xEDmbolo: ${tape[headIndex]})
        Regla Activa: ${JSON.stringify(currentRule)}
        Pr\xF3xima Acci\xF3n: ${nextAction}
        
        Proporciona una explicaci\xF3n concisa y educativa (m\xE1ximo 2 l\xEDneas) sobre la transici\xF3n, mencionando el cambio de estado, el s\xEDmbolo escrito y el movimiento del cabezal.
      `;
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash-latest",
        contents: prompt
      });
      res.json({ explanation: response.text });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/generate-exercise", async (req, res) => {
    try {
      const { difficulty } = req.body;
      const prompt = `Genera un ejercicio de M\xE1quina de Turing para un estudiante de nivel ${difficulty} en espa\xF1ol.
      Incluye un t\xEDtulo, una descripci\xF3n (el objetivo) y un ejemplo de entrada/salida esperado.
      Devuelve la respuesta en formato JSON: { "title": "...", "description": "...", "target": "..." }`;
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash-latest",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const data = JSON.parse(response.text);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
