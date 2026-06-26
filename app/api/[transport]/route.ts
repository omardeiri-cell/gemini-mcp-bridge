import { z } from "zod";
import { createMcpHandler } from "mcp-handler";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });
const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "imagen-4.0-generate-001";

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "generate_image",
      "Generate an image with Google Gemini / Imagen from a text prompt. Returns a PNG image.",
      {
        prompt: z.string().describe("Full descriptive image prompt."),
        aspect_ratio: z
          .enum(["1:1", "9:16", "16:9", "3:4", "4:3"])
          .optional()
          .describe("Output aspect ratio. Default 9:16."),
      },
      async ({ prompt, aspect_ratio }) => {
        try {
          const res = await ai.models.generateImages({
            model: MODEL,
            prompt,
            config: { numberOfImages: 1, aspectRatio: aspect_ratio ?? "9:16" },
          });
          const bytes = res?.generatedImages?.[0]?.image?.imageBytes;
          if (!bytes) {
            return { content: [{ type: "text", text: "No image returned. Raw: " + JSON.stringify(res).slice(0, 600) }] };
          }
          return {
            content: [
              { type: "image", data: bytes, mimeType: "image/png" },
              { type: "text", text: `Generated with ${MODEL} at ${aspect_ratio ?? "9:16"}.` },
            ],
          };
        } catch (e) {
          return { content: [{ type: "text", text: "Image generation error: " + (e?.message ?? String(e)) }] };
        }
      }
    );
  },
  {},
  { basePath: "/api" }
);

export { handler as GET, handler as POST, handler as DELETE };
