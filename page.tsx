export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 48, lineHeight: 1.6 }}>
      <h1>Gemini MCP Bridge</h1>
      <p>This is a private MCP server that lets Claude generate images with Google Gemini / Imagen.</p>
      <p>MCP endpoint (add this URL as a custom connector in Claude):</p>
      <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8 }}>
        https://YOUR-DEPLOYMENT.vercel.app/api/mcp
      </pre>
    </main>
  );
}
