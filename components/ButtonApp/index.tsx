console.log('React version:', React.version);

import { DailyTransport } from "@daily-co/realtime-ai-daily";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import React, { useEffect, useRef, useState } from "react";
import { LLMHelper, RTVIClient } from "realtime-ai";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";

import { AppProvider } from "@/components/context";
import {
  BOT_READY_TIMEOUT,
  defaultConfig,
  defaultServices,
} from "@/rtvi.config";
import ButtonInner from "./ButtonInner";

export default function ButtonApp({ chatId = "", llmUrl = "", requestTemplate = null }: { chatId?: string, llmUrl?: string, requestTemplate?: any }) {
  const urlParams = new URLSearchParams(window.location.search);
  console.log('llmUrl', urlParams.get('llmUrl'))
  console.log('requestTemplate', urlParams.get('requestTemplate'))
  llmUrl =  llmUrl || urlParams.get('llmUrl')
  requestTemplate = requestTemplate || (urlParams.get('requestTemplate') ? JSON.parse(urlParams.get('requestTemplate')) : null);
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
        baseUrl: "/api",
        requestData: {
          services: defaultServices,
          config: defaultConfig,
          chatId,
          llmUrl,
          requestTemplate: JSON.stringify(requestTemplate),
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
    setTimeout(() => setShowSplash(false), 10)
  }, [])

  if (showSplash) return null
  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <AppProvider>
        <TooltipProvider>
          <ButtonInner />
        </TooltipProvider>
      </AppProvider>
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}
