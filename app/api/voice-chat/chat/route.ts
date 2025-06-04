import { NextRequest } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1667677",
  key: "fb609e51dceb9a27d79c",
  secret: "ad540543638d6ffef055",
  cluster: "mt1",
});

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new Response("Missing chatId in query params", { status: 400 });
  }

  // 读取请求体
  const bodyText = await req.text();

  // 请求 LLM 接口
  const llmRes = await fetch(
    "https://voice-agent-gw.api.newcast.ai/chat/completions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "conversation_id", content: chatId },
          { role: "user", content: bodyText },
        ],
      }),
    }
  );

  if (!llmRes.body) {
    return new Response("No response body", { status: 500 });
  }

  const encoder = new TextEncoder();
  const reader = llmRes.body.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      const timestamp = Date.now();
      let order = 0;
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          const text = decoder.decode(value);
          for (const line of text.split("\n")) {
            if (line.trim() && !line.includes("[DONE]")) {
              try {
                const json = JSON.parse(line.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  await pusher.trigger(`chat-${chatId}`, "client-message", {
                    message: content,
                    timestamp,
                    order,
                  });
                  controller.enqueue(encoder.encode(`data: ${content}\n\n`));
                  order++;
                }
              } catch (err) {
                console.error("[JSON parse error]", err);
              }
            }
          }
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
