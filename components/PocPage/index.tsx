import Splash from "./Splash";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useRef, useState } from "react";
import { LLMHelper, RTVIClient } from "@pipecat-ai/client-js";
import { RTVIClientAudio, RTVIClientProvider } from "@pipecat-ai/client-react";
import { BOT_READY_TIMEOUT } from "@/rtvi.config";
import { AppProvider } from "../context";
import App from "./App";
import { CallSettings } from "@/types/projects";
import { config } from "@/middleware";

const PocPage = ({
  appId,
  settings,
}: {
  appId: string;
  settings: CallSettings;
}) => {
  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<RTVIClient | null>(null);

  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }

    const voiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: "/api/project/" + appId,
        requestData: {
          appId,
          config: settings.config,
          services: settings.services,
        },
      },
      timeout: BOT_READY_TIMEOUT,
    });

    voiceClientRef.current = voiceClient;
  }, [showSplash]);

  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }
  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <AppProvider {...settings}>
        <TooltipProvider>
          <main>
            <div id="app">
              <App />
            </div>
          </main>
          <aside id="tray" />
        </TooltipProvider>
      </AppProvider>
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
};

export default PocPage;
