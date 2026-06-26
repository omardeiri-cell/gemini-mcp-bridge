# Gemini ⇄ Claude MCP Bridge

A tiny private MCP server that lets Claude generate images with Google Gemini / Imagen.
Deploy it once on Vercel, add its URL as a custom connector in Claude, and Claude can
call `generate_image` directly.

Exposed tool: `generate_image(prompt, aspect_ratio?)` → returns a PNG.

---

## STEP 1 — Get a Gemini API key
1. Go to https://aistudio.google.com/apikey
2. Click **Create API key** and copy it.

## STEP 2 — Deploy on Vercel (CLI, fastest)
```bash
npm install
npm i -g vercel
vercel            # log in, accept defaults → gives a *.vercel.app URL
vercel env add GEMINI_API_KEY     # paste your key, choose Production
vercel --prod     # redeploy with the key
```
(Alternative: push this folder to GitHub → import in the Vercel dashboard →
add the env var **GEMINI_API_KEY** under Settings → Environment Variables → Redeploy.)

## STEP 3 — Get your connector URL
Your MCP endpoint is your deployment URL + `/api/mcp`, e.g.:
```
https://gemini-mcp-bridge-xxxx.vercel.app/api/mcp
```

## STEP 4 — Add it to Claude
1. Claude → **Customize → Connectors**.
2. Click **+** → **Add custom connector**.
3. Paste the `/api/mcp` URL → **Add**.
4. In the chat, open the **+** menu → **Connectors** → toggle it **on**.

## STEP 5 — Use it
Tell Claude: *"Gemini is connected — generate the 6 frames."*
Claude will call `generate_image` for each prompt and receive the images directly.

---

## Notes
- **Model id**: defaults to `imagen-4.0-generate-001`. If you get a "model not found"
  error, copy the current Imagen id from AI Studio into the `GEMINI_IMAGE_MODEL` env var.
- **Timeout**: image generation can take a few seconds; the route allows up to 60s.
- **Auth**: this server is open by default (anyone with the URL can spend your Gemini
  quota). Keep the URL private. For production, wrap the handler with `withMcpAuth`
  (see Vercel MCP docs) or add OAuth.
- **Cost**: each generation consumes your Google AI Studio quota/billing, not Claude.
