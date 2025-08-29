import Splash from "./Splash";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useRef, useState } from "react";
import { PipecatClient } from "@pipecat-ai/client-js";
import { PipecatClientAudio, PipecatClientProvider } from "@pipecat-ai/client-react";
import { BOT_READY_TIMEOUT } from "@/rtvi.config";
import { AppProvider } from "../context";
import App from "./App";
import { CallSettings } from "@/types/projects";

const PocPage = ({
  appId,
  settings,
}: {
  appId: string;
  settings: CallSettings;
}) => {
  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<PipecatClient | null>(null);

  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }

    const voiceClient = new PipecatClient({
      transport: new DailyTransport(),
      enableMic: true,
      enableCam: false,
    });

    voiceClientRef.current = voiceClient;
  }, [showSplash]);

  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }
  return (
    <PipecatClientProvider client={voiceClientRef.current!}>
      <AppProvider {...settings}>
        <TooltipProvider>
          <main>
            <div id="app">
              <App appId={appId} />
            </div>
          </main>
          <aside id="tray" />
        </TooltipProvider>
      </AppProvider>
      <PipecatClientAudio />
    </PipecatClientProvider>
  );
};

export default PocPage;
