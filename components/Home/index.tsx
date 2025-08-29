import { DailyTransport } from "@pipecat-ai/daily-transport";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useRef, useState } from "react";
import { PipecatClient } from "@pipecat-ai/client-js";
import { PipecatClientAudio, PipecatClientProvider } from "@pipecat-ai/client-react";

import App from "@/components/App";
import { AppProvider } from "@/components/context";
import Header from "@/components/Header";
import Splash from "@/components/Splash";
import {
  BOT_READY_TIMEOUT,
  defaultConfig,
  defaultServices,
} from "@/rtvi.config";

export default function Home() {
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
      <AppProvider>
        <TooltipProvider>
          <main>
            <Header />
            <div id="app">
              <App />
            </div>
          </main>
          <aside id="tray" />
        </TooltipProvider>
      </AppProvider>
      <PipecatClientAudio />
    </PipecatClientProvider>
  );
}
