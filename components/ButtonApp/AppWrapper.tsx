import React, { useEffect, useRef, useState } from "react";

import { DailyTransport } from "@pipecat-ai/daily-transport";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { PipecatClient, RTVIError } from "@pipecat-ai/client-js";
import { PipecatClientAudio, PipecatClientProvider } from "@pipecat-ai/client-react";

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
  appId = "",
  chatId = null,
  llmUrl = null,
  requestTemplate = null,
  openStatement = false,
  setVoiceBotState: _setVoiceBotState,
  connectedComponent,
  onLeave,
}: {
  appId?: string;
  chatId?: string;
  llmUrl?: string;
  requestTemplate?: any;
  openStatement?: boolean;
  setVoiceBotState?: (state: string) => void;
  connectedComponent?: React.FC<{ onClick: () => void }>;
  onLeave?: () => void;
}) {
  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<PipecatClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSetVoiceBotState = (state: string) => {
    _setVoiceBotState?.(state);
  };

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
      await voiceClientRef.current.startBotAndConnect({
        endpoint: "/api/connect",
        requestData: {
          appId,
          services: defaultServices,
          config: defaultConfig,
          chatId,
          llmUrl,
          requestTemplate,
          openStatement: openStatement,
        },
      });
    } catch (e) {
      setError((e as RTVIError).message || "Unknown error occured");
      voiceClientRef.current.disconnect();
    }
  }

  const handleLeave = async () => {
    voiceClientRef.current?.disconnect();
    voiceClientRef.current.tracks().local.audio?.stop();
    voiceClientRef.current.tracks().local.screenAudio?.stop();
    voiceClientRef.current.tracks().local.video?.stop();
    (voiceClientRef.current.transport as any)._daily.destroy();
    const allTracks = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    allTracks.getTracks().forEach((track) => {
      track.stop();
    });

    document.querySelectorAll("audio, video").forEach((el: any) => {
      el.srcObject = null;
    });

    voiceClientRef.current = null;
    onLeave?.();
  };

  if (showSplash) return null;
  return (
    <PipecatClientProvider client={voiceClientRef.current!}>
      <AppProvider config={defaultConfig}>
        <TooltipProvider>
          <ButtonInner
            onLeave={handleLeave}
            error={error}
            setVoiceBotState={handleSetVoiceBotState}
            connectedComponent={connectedComponent}
          />
        </TooltipProvider>
      </AppProvider>
      <PipecatClientAudio />
    </PipecatClientProvider>
  );
}
