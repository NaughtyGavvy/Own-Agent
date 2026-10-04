const { GoogleGenAI } = require("@google/genai");

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { message, history = [] } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured"
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const contents = [];

    for (const item of history) {

      if (
        item.role !== "user" &&
        item.role !== "model"
      ) {
        continue;
      }

      contents.push({
        role: item.role,
        parts: [
          {
            text: String(item.text || "")
          }
        ]
      });
    }

    contents.push({
      role: "user",
      parts: [
        {
          text: message
        }
      ]
    });

    const response = await ai.models.generateContent({

      model: "gemini-2.5-flash",

      contents: contents,

      config: {
        systemInstruction: `
You are NOVA, a helpful personal AI agent.

You can help the user with:
- Questions
- Programming
- Websites
- Games
- Business ideas
- Writing
- Learning
- Problem solving

Give clear, useful and organized answers.

Do not claim that you performed an action unless you actually performed it.
        `
      }

    });

    return res.status(200).json({
      reply: response.text
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "AI request failed",
      details: error.message
    });

  }

};
