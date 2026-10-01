import http from "node:http";
// Owned stateless HTTP MCP endpoint. A real tested Agent must initialize it,
// discover its schema, and call the issued tool; no saved user MCP is started.
export async function startLocalMcpFixture() {
  const requests = [], sockets = new Set();
  const server = http.createServer(async (request, response) => {
    if (request.method === "GET" || request.method === "DELETE") { response.writeHead(405); response.end(); return; }
    let text = ""; for await (const part of request) text += part;
    let message; try { message = JSON.parse(text); } catch { response.writeHead(400); response.end(); return; }
    const record = { method: message.method, id: message.id, name: message.params?.name, arguments: message.params?.arguments }; requests.push(record);
    if (message.id === undefined) { response.writeHead(202); response.end(); return; }
    let result, error;
    switch (message.method) {
      case "initialize": result = { protocolVersion: message.params?.protocolVersion || "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "GameCowork owned MCP fixture", version: "1.0.0" } }; break;
      case "ping": result = {}; break;
      case "tools/list": result = { tools: [{ name: "owned_echo", description: "Echo an owned test marker without touching files or network", inputSchema: { type: "object", properties: { value: { type: "string" } }, required: ["value"], additionalProperties: false } }] }; break;
      case "resources/list": result = { resources: [] }; break;
      case "prompts/list": result = { prompts: [] }; break;
      case "tools/call":
        if (message.params?.name === "owned_echo" && typeof message.params?.arguments?.value === "string") { record.called = true; result = { content: [{ type: "text", text: "OWNED_MCP_ECHO:" + message.params.arguments.value }] }; }
        else error = { code: -32602, message: "Invalid owned fixture tool request" };
        break;
      default: error = { code: -32601, message: "Unsupported owned fixture method" };
    }
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ jsonrpc: "2.0", id: message.id, ...(error ? { error } : { result }) }));
  });
  server.on("connection", socket => { sockets.add(socket); socket.once("close", () => sockets.delete(socket)); });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  return { url: `http://127.0.0.1:${server.address().port}/mcp`, requests,
    async close() { for (const socket of sockets) socket.destroy(); await new Promise(resolve => server.close(resolve)); } };
}
