import http from "node:http";
import { randomUUID } from "node:crypto";

// Local OpenAI-compatible test endpoint. It never reads a project or contacts
// another service: a tool result must come back from the actual tested Agent.
export async function startMockProvider({ model = "fixture-model", apiKey = "fixture-no-real-key", fixtureFile,
  expectedFileSentinel = "GCW_FIXTURE_FILE_CONTENT", chunkDelayMs = 120, slowIntervalMs = 200,
  toolPlans = {}, systemPromptSentinel } = {}) {
  const requests = [];
  const sockets = new Set();
  const issuedReadToolIds = new Set();
  const issuedActionTools = new Map();
  let sequence = 0;
  const timers = new Set();
  const server = http.createServer(async (request, response) => {
    let bytes = "";
    for await (const chunk of request) bytes += chunk;
    let body;
    try { body = bytes ? JSON.parse(bytes) : {}; } catch {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: { message: "Invalid fixture JSON", type: "fixture" } }));
      return;
    }
    const text = (value) => typeof value === "string" ? value : Array.isArray(value)
      ? value.map((item) => item.text || item.content || "").join("\n") : "";
    const userText = [...(body.messages || [])].reverse().find((message) => message.role === "user");
    const prompt = text(userText?.content);
    const planKey = Object.keys(toolPlans).find((marker) => prompt.includes(marker));
    const plan = planKey ? toolPlans[planKey] : undefined;
    const toolText = (body.messages || []).filter((message) => message.role === "tool").map((message) => text(message.content)).join("\n");
    const readToolText = (body.messages || []).filter((message) => message.role === "tool" && issuedReadToolIds.has(message.tool_call_id))
      .map((message) => text(message.content)).join("\n");
    const scenario = planKey || (/GCW_E2E_READ_FILE/.test(prompt) ? "read-file"
      : /GCW_E2E_SLOW|slow fixture|test cancellation/i.test(prompt) ? "slow"
        : /GCW_E2E_B/.test(prompt) ? "workspace-b" : /GCW_E2E_A/.test(prompt) ? "workspace-a" : "normal");
    const record = { id: ++sequence, method: request.method, url: request.url, stream: body.stream === true,
      model: body.model, scenario, authorized: request.headers.authorization === `Bearer ${apiKey}`,
      messageCount: body.messages?.length || 0, toolNames: (body.tools || []).map((item) => item.function?.name),
      hasToolResult: toolText.length > 0, toolResultContainsFixture: toolText.includes(expectedFileSentinel),
      hasReadToolResult: readToolText.length > 0, readToolResultContainsFixture: readToolText.includes(expectedFileSentinel),
      firstTurnPresent: JSON.stringify(body.messages || []).includes("GCW_E2E_A"), chunksSent: 0, completed: false, aborted: false };
    if (systemPromptSentinel) record.systemPromptContainsSentinel = (body.messages || []).some(message => message.role === "system" && text(message.content).includes(systemPromptSentinel));
    requests.push(record);
    response.once("close", () => { record.aborted = !record.completed; });
    if (!record.authorized) {
      response.writeHead(401, { "content-type": "application/json" });
      record.completed = true;
      response.end(JSON.stringify({ error: { message: "Synthetic fixture credential is required", type: "fixture_auth" } }));
      return;
    }
    if (request.url === "/v1/models") {
      response.setHeader("content-type", "application/json");
      record.completed = true;
      response.end(JSON.stringify({ object: "list", data: [{ id: model, object: "model", owned_by: "fixture" }] }));
      return;
    }
    if (request.url !== "/v1/chat/completions") {
      response.writeHead(404, { "content-type": "application/json" });
      record.completed = true;
      response.end(JSON.stringify({ error: { message: "Unsupported loopback fixture endpoint", type: "fixture" } }));
      return;
    }
    const chatId = `fixture-${randomUUID()}`;
    const frame = (delta, finishReason = null) => ({ id: chatId, object: "chat.completion.chunk", created: 1, model,
      choices: [{ index: 0, delta, finish_reason: finishReason }] });
    const send = (delta, finishReason = null) => {
      if (response.destroyed) return;
      record.chunksSent++;
      response.write(`data: ${JSON.stringify(frame(delta, finishReason))}\n\n`);
    };
    const finish = (reason = "stop") => {
      if (response.destroyed) return;
      send({}, reason);
      record.completed = true;
      response.end("data: [DONE]\n\n");
    };
    const later = (callback, delay) => {
      const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
      response.once("close", () => { clearTimeout(timer); timers.delete(timer); });
    };
    let content = scenario === "workspace-a" ? "GCW_REPLY_A_FIRST GCW_REPLY_A_COMPLETE"
      : scenario === "workspace-b" ? "GCW_REPLY_B_FIRST GCW_REPLY_B_COMPLETE"
        : scenario === "read-file" && record.readToolResultContainsFixture ? "GCW_TOOL_READ_CONFIRMED" : "Hello fixture";
    let toolCall;
    if (plan) {
      const steps = Array.isArray(plan.steps) ? plan.steps : [plan];
      const matched = (body.messages || []).filter((message) => message.role === "tool"
        && issuedActionTools.get(message.tool_call_id)?.planKey === planKey);
      record.toolResultMatchedIssuedId = matched.length > 0;
      let verifiedSteps = 0, failed = false;
      for (let index = 0; index < steps.length; index++) {
        const message = [...matched].reverse().find(message => issuedActionTools.get(message.tool_call_id)?.stepIndex === index);
        if (!message) break;
        const issued = issuedActionTools.get(message.tool_call_id);
        if (issued.verified === undefined) {
          const resultText = text(message.content);
          const exitCode = /Exit Code:\s*(-?\d+)/.exec(resultText);
          if (exitCode) issued.exitCode = Number(exitCode[1]);
          issued.verified = false;
          try { issued.verified = await steps[index].verify?.(resultText) === true; }
          catch (error) { issued.verificationError = error.code || error.name || 'FixtureVerificationError'; }
        }
        if (issued.exitCode !== undefined) record.toolResultExitCode = issued.exitCode;
        if (issued.verificationError) record.toolResultVerificationError = issued.verificationError;
        if (!issued.verified) { failed = true; break; }
        verifiedSteps++;
      }
      record.verifiedStepCount = verifiedSteps;
      record.stepResultVerified = verifiedSteps > 0;
      record.toolResultVerified = !failed && verifiedSteps === steps.length;
      if (failed) content = `${planKey}_FAILED`;
      else if (record.toolResultVerified) content = `${planKey}_CONFIRMED`;
      else {
        const step = steps[verifiedSteps];
        const tool = (body.tools || []).find((item) => item.function?.name === step.toolName);
        if (tool) {
          record.requestedActionTool = tool.function.name;
          record.actionStepIndex = verifiedSteps;
          toolCall = { id: `action-${record.id}-${verifiedSteps}`, type: "function", function: { name: tool.function.name,
            arguments: JSON.stringify(step.arguments) } };
          issuedActionTools.set(toolCall.id, { planKey, stepIndex: verifiedSteps });
        } else content = `${planKey}_UNAVAILABLE`;
      }
    } else if (scenario === "read-file" && !record.hasReadToolResult) {
      const tool = (body.tools || []).find((item) => /read_?file|read_text_file/i.test(item.function?.name || ""));
      const fields = tool?.function?.parameters?.properties || {};
      const pathKey = ["absolute_path", "file_path", "path", "filepath"].find((key) => key in fields);
      if (tool && pathKey && fixtureFile) {
        record.requestedReadTool = tool.function.name;
        toolCall = { id: `read-${record.id}`, type: "function", function: { name: tool.function.name,
          arguments: JSON.stringify({ [pathKey]: fixtureFile }) } };
        issuedReadToolIds.add(toolCall.id);
      } else content = "GCW_READ_TOOL_UNAVAILABLE";
    } else if (scenario === "read-file" && !record.readToolResultContainsFixture) content = "GCW_TOOL_READ_FAILED";
    if (!body.stream) {
      response.setHeader("content-type", "application/json");
      record.completed = true;
      response.end(JSON.stringify({ id: chatId, object: "chat.completion", created: 1, model,
        choices: [{ index: 0, message: toolCall ? { role: "assistant", content: null, tool_calls: [toolCall] }
          : { role: "assistant", content }, finish_reason: toolCall ? "tool_calls" : "stop" }],
        usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 } }));
      return;
    }
    response.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache" });
    if (toolCall) {
      send({ tool_calls: [{ index: 0, ...toolCall }] });
      later(() => finish("tool_calls"), chunkDelayMs);
    } else if (scenario === "slow") {
      send({ content: "GCW_SLOW_STARTED" });
      const interval = setInterval(() => send({ content: " GCW_SLOW_CHUNK" }), slowIntervalMs);
      timers.add(interval);
      response.once("close", () => { clearInterval(interval); timers.delete(interval); });
      later(() => { clearInterval(interval); timers.delete(interval); finish(); }, 15000);
    } else {
      const split = content.indexOf(" ");
      send({ content: split < 0 ? content : content.slice(0, split) });
      later(() => { if (split >= 0) send({ content: content.slice(split) }); }, chunkDelayMs);
      later(() => finish(), chunkDelayMs * 2);
    }
  });
  server.on("connection", (socket) => { sockets.add(socket); socket.once("close", () => sockets.delete(socket)); });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  return { origin, baseUrl: origin + "/v1", model, apiKey, requests,
    async close() {
      for (const timer of timers) { clearTimeout(timer); clearInterval(timer); }
      timers.clear();
      for (const socket of sockets) socket.destroy();
      await new Promise((resolve) => server.close(resolve));
    },
  };
}
