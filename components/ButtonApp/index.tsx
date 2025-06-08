import React, { useEffect, useRef, useState } from "react";
console.log('React version:', React.version);
console.log('Remote React instance:', React);
// @ts-ignore
console.log('Same instance as host:', React === window.__hostReact__); // 这里应为 true，如果不是说明共享失败

import { DailyTransport } from "@daily-co/realtime-ai-daily";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { LLMHelper, RTVIClient } from "realtime-ai";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";

import { AppProvider } from "@/components/context";
import {
  BOT_READY_TIMEOUT,
  defaultServices,
  BOT_PROMPT
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
      { name: "provider", value: 'cartesia' },
      { name: "voice", value: 'c59c247b-6aa9-4ab6-91f9-9eabea7dc69e' },
      { name: "model", value: 'cartesia' },
      { name: "language", value: 'zh' },
    ],
  },
  {
    service: "llm",
    options: [
      { name: "provider", value: "anker" },
      { name: "model", value: "anker-prod" },
      { name: "system_prompt", value: BOT_PROMPT["zh"] },
      { name: "run_on_config", value: true },
    ],
  },
  {
    service: "stt",
    options: [
      { name: "provider", value: 'deepgram' },
      { name: "model", value: 'nova-2-general' },
      { name: "language", value: 'zh' },
    ],
  },
]

export default function ButtonApp({ chatId = "", llmUrl = "", requestTemplate = null }: { chatId?: string, llmUrl?: string, requestTemplate?: any }) {
  console.log('llmUrl', llmUrl)
  console.log('requestTemplate', requestTemplate)

  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<RTVIClient | null>(null);

  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }

    const voiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: "https://voice-agent-dev.newcast.ai/api",
        requestData: {
          services: defaultServices,
          config: defaultConfig,
          chatId,
          llmUrl,
          requestTemplate,
          openStatement: true,
        },
      },
      timeout: BOT_READY_TIMEOUT,
    });

    const llmHelper = new LLMHelper({});
    voiceClient.registerHelper("llm", llmHelper);

    voiceClientRef.current = voiceClient;
  }, [showSplash]);

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 10)
  }, [])

  if (showSplash) return null
  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <AppProvider config={defaultConfig}>
        <TooltipProvider>
          <ButtonInner />
        </TooltipProvider>
      </AppProvider>
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}
