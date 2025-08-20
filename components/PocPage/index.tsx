import Splash from "./Splash";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useRef, useState } from "react";
import { RTVIClient } from "@pipecat-ai/client-js";
import { RTVIClientAudio, RTVIClientProvider } from "@pipecat-ai/client-react";
import { BOT_READY_TIMEOUT } from "@/rtvi.config";
import { AppProvider } from "../context";
import App from "./App";
import { CallSettings } from "@/types/projects";

import Logo from "@/assets/icons/voc.svg";
import Image from "next/image";

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
  console.log(11);
  return (
    <div className="flex w-full h-full relative">
      <div className="absolute top-6 left-6">
        <Image alt="logo" src={Logo} width={140} />
      </div>
      {showSplash ? (
        <Splash handleReady={() => setShowSplash(false)} />
      ) : (
        <RTVIClientProvider client={voiceClientRef.current!}>
          <AppProvider {...settings}>
            <TooltipProvider>
              <main className="flex-row">
                <div id="app">
                  <App />
                </div>
                <aside id="tray" />
              </main>
            </TooltipProvider>
          </AppProvider>
          <RTVIClientAudio />
        </RTVIClientProvider>
      )}
    </div>
  );
};

export default PocPage;
