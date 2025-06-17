// @ts-nocheck
import NextCors from "nextjs-cors";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default async (req, res) => {
  await NextCors(req, res, {
    methods: ["POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const requestBody = req.body;

  try {
    const chatId = requestBody.chatId || uuidv4();
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/start-tavus`;
    const body = {
      room_url: "",
      token: "",
      language: "en",
      tts_model: {
        provider: "cartesia",
        voice: "8d8ce8c9-44a4-46c4-b10f-9a927b99a853",
      },
      llm_model: {
        provider: "anker",
        model: "anker-prod",
        customer: "anker",
        system_prompt: "",
      },
      vad_params: {
        start_secs: 0.2,
        stop_secs: 0.8,
        confidence: 1,
        min_volume: 0.6,
      },
      chat_id: chatId,
      template: JSON.stringify({
        chatId: chatId,
        messages: { role: "USER", content: "", id: uuidv4() },
        touchPoint: "LIVE_CHAT",
        encrypt: false,
        page: "Shulex VoC",
        browserLang: "zh-CN",
        browserUA:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        noHeader: false,
        noBrand: false,
        host: "desk-staging.shulex.com",
        href: "https://desk-staging.shulex.com/live-chat?id=115&token=652F8913E4B07AD116B3B8D6",
        ref: "https://desk-staging.shulex.com/live-chat?id=115&token=652F8913E4B07AD116B3B8D6",
        metadata: {
          brand: "Shulex12321",
          encrypt: false,
          page: "Shulex VoC",
          browserLang: "zh-CN",
          browserUA:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
          noHeader: false,
          noBrand: false,
          host: "desk-staging.shulex.com",
          href: "https://desk-staging.shulex.com/live-chat?id=115&token=652F8913E4B07AD116B3B8D6",
          time_zone: "GMT-07:00",
        },
        option: {
          language: "AUTO",
          token: "652F8913E4B07AD116B3B8D6",
        },
        via: {
          type: "EMAIL",
          uid: "3b416ffe@fake.com",
        },
      }),
      open_statement:
        "Hello! Welcome to Zenni Optical. How can I assist you with your eyewear needs today? Whether you have questions or need recommendations, I'm here to help.",
      llm_url:
        requestBody.llmUrl ||
        "https://desk-staging.shulex.com/api_v2/gpt/bot/115/chat/stream",
    };
    const response = await axios.post(url, body);

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(error.response?.status || 500)
      .json({ error: "An error occurred" });
  }
};
