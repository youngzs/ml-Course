
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      console.error("API_KEY is not set in environment variables.");
      // In a real app, you might want to throw an error or handle this more gracefully.
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }
  
  public createChat(systemInstruction: string): Chat {
    return this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
    });
  }

  public async generateChatResponseStream(
    chat: Chat, 
    message: string, 
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await chat.sendMessageStream({ message });
      for await (const chunk of response) {
        onChunk(chunk.text);
      }
    } catch (error) {
      console.error("Error generating streaming chat response:", error);
      onChunk("抱歉，我暂时无法回答。请稍后再试。");
    }
  }

  public async generateImage(prompt: string): Promise<string | null> {
    try {
      const response = await this.ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }

  public async generateDiagramCode(prompt: string): Promise<string | null> {
    try {
      const fullPrompt = `
        Generate a Mermaid.js graph code for the following request.
        Only output the Mermaid code block, starting with \`\`\`mermaid and ending with \`\`\`.
        Do not include any other explanation or text.
        Request: ${prompt}
      `;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });
      
      const text = response.text;
      const mermaidCode = text.match(/```mermaid([\s\S]*?)```/);
      return mermaidCode ? mermaidCode[1].trim() : null;

    } catch (error) {
      console.error("Error generating diagram code:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
