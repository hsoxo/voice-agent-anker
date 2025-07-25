import { DailyTransport } from "@pipecat-ai/daily-transport";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useRef, useState } from "react";
import { LLMHelper, RTVIClient } from "@pipecat-ai/client-js";
import { RTVIClientAudio, RTVIClientProvider } from "@pipecat-ai/client-react";

import App from "@/components/App";
import { AppProvider } from "@/components/context";
import { BOT_READY_TIMEOUT } from "@/rtvi.config";
import { Toaster } from "sonner";
import { ServiceConfig } from "@/types/projects";

export default function Home({
  projectId,
  defaultConfig,
  defaultServices,
}: {
  projectId: string;
  defaultConfig: ServiceConfig[];
  defaultServices: { [key: string]: string };
}) {
  const voiceClientRef = useRef<RTVIClient | null>(null);
  const [initDone, setInitDone] = useState(false);

  useEffect(() => {
    if (voiceClientRef.current) {
      return;
    }

    const voiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: `/api/project/${projectId}`,
        requestData: {
          services: defaultServices,
          config: defaultConfig,
        },
      },
      timeout: BOT_READY_TIMEOUT,
    });

    const llmHelper = new LLMHelper({});
    voiceClient.registerHelper("llm", llmHelper);

    voiceClientRef.current = voiceClient;
    setInitDone(true);
  }, []);

  const language = defaultConfig
    ?.find((c) => c.service === "tts")
    ?.options?.find((o) => o.name === "language")?.value;

  if (!initDone) {
    return null;
  }
  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <AppProvider
        config={defaultConfig}
        services={defaultServices}
        language={language ?? "en"}
      >
        <TooltipProvider>
          <App projectId={projectId} allowSave />
          <Toaster position="top-center" />
        </TooltipProvider>
      </AppProvider>
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}
