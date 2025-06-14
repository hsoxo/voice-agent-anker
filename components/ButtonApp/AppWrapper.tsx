import React, { useEffect, useRef, useState } from "react";

import { DailyTransport } from "@daily-co/realtime-ai-daily";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { LLMHelper, RTVIClient, RTVIError } from "realtime-ai";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";

import { AppProvider } from "@/components/context";
import {
  BOT_READY_TIMEOUT,
  defaultServices,
  BOT_PROMPT,
} from "../../rtvi.config";
import ButtonInner from "./ButtonInner";

const defaultConfig = [
  {
    service: "vad",
    options: [
      {
        name: "params",
        value: {
          start_secs: 0.2,
          stop_secs: 0.8,
          confidence: 1,
          min_volume: 0.6,
        },
      },
    ],
  },
  {
    service: "tts",
    options: [
      { name: "provider", value: "cartesia" },
      { name: "voice", value: "8d8ce8c9-44a4-46c4-b10f-9a927b99a853" },
      { name: "model", value: "cartesia" },
      { name: "language", value: "en" },
    ],
  },
  {
    service: "llm",
    options: [
      { name: "provider", value: "anker" },
      { name: "model", value: "anker-prod" },
      { name: "system_prompt", value: BOT_PROMPT["en"] },
      { name: "run_on_config", value: true },
    ],
  },
  {
    service: "stt",
    options: [
      { name: "provider", value: "deepgram" },
      { name: "model", value: "nova-3-general" },
      { name: "language", value: "en" },
    ],
  },
];

export default function AppWrapper({
  chatId = null,
  llmUrl = null,
  requestTemplate = null,
  setVoiceBotState: _setVoiceBotState,
  connectedComponent,
  onLeave,
}: {
  chatId?: string;
  llmUrl?: string;
  requestTemplate?: any;
  setVoiceBotState?: (state: string) => void;
  connectedComponent?: React.FC<{ onClick: () => void }>;
  onLeave?: () => void;
}) {
  console.log("render");
  // console.log("llmUrl", llmUrl);
  // console.log("requestTemplate", requestTemplate);

  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<RTVIClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSetVoiceBotState = (state: string) => {
    _setVoiceBotState?.(state);
  };

  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }

    const voiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/api`,
        requestData: {
          services: defaultServices,
          config: defaultConfig,
          chatId,
          llmUrl,
          requestTemplate,
          openStatement: false,
        },
      },
      timeout: BOT_READY_TIMEOUT,
    });

    const llmHelper = new LLMHelper({});
    voiceClient.registerHelper("llm", llmHelper);

    voiceClientRef.current = voiceClient;
  }, [showSplash]);

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 10);
  }, []);

  async function start() {
    if (!voiceClientRef.current) return;

    // Join the session
    try {
      // Disable the mic until the bot has joined
      // to avoid interrupting the bot's welcome message
      voiceClientRef.current.enableMic(true);
      await voiceClientRef.current.connect();
    } catch (e) {
      setError((e as RTVIError).message || "Unknown error occured");
      voiceClientRef.current.disconnect();
    }
  }

  if (showSplash) return null;
  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <AppProvider config={defaultConfig}>
        <TooltipProvider>
          <ButtonInner
            onLeave={onLeave}
            error={error}
            setVoiceBotState={handleSetVoiceBotState}
            connectedComponent={connectedComponent}
          />
        </TooltipProvider>
      </AppProvider>
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}
