"use client";

import { Ear, Loader2 } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RTVIError, RTVIEvent, RTVIMessage } from "@pipecat-ai/client-js";
import {
  usePipecatClient,
  useRTVIClientEvent,
  usePipecatClientTransportState,
} from "@pipecat-ai/client-react";

import { AppContext } from "./context";
import Session from "./Session";
import { Configure } from "./Setup";
import { Alert } from "./ui/alert";
import { Button } from "./ui/button";
import * as Card from "./ui/card";
import { toast } from "sonner";
import { updateProjectCallSettings } from "@/services/projects";

const status_text = {
  idle: "Initializing...",
  initialized: "Start",
  authenticating: "Requesting bot...",
  connecting: "Connecting...",
  disconnected: "Start",
};

export default function App({
  allowConfigChange = true,
  allowSave = false,
  projectId = null,
  endpoint = '/api/connect'
}: {
  allowConfigChange?: boolean;
  allowSave?: boolean;
  projectId?: string;
  endpoint?: string;
}) {
  const voiceClient = usePipecatClient()!;
  const transportState = usePipecatClientTransportState();

  const [appState, setAppState] = useState<
    "idle" | "ready" | "connecting" | "connected"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(false);
  const { clientParams } = useContext(AppContext);

  const handleSave = () => {
    updateProjectCallSettings(projectId, clientParams.config);
    toast.success("Settings saved");
  };

  useRTVIClientEvent(
    RTVIEvent.Error,
    useCallback((message: RTVIMessage) => {
      const errorData = message.data as { error: string; fatal: boolean };
      if (!errorData.fatal) return;
      setError(errorData.error);
    }, [])
  );

  useEffect(() => {
    // Initialize local audio devices
    if (!voiceClient || mountedRef.current) return;
    mountedRef.current = true;
    voiceClient.initDevices();
  }, [appState, voiceClient]);

  useEffect(() => {
    // Update app state based on voice client transport state.
    // We only need a subset of states to determine the ui state,
    // so this effect helps avoid excess inline conditionals.
    switch (transportState) {
      case "initialized":
      case "disconnected":
        setAppState("ready");
        break;
      case "authenticating":
      case "connecting":
        setAppState("connecting");
        break;
      case "connected":
      case "ready":
        setAppState("connected");
        break;
      default:
        setAppState("idle");
    }
  }, [transportState]);

  async function start() {
    if (!voiceClient) return;

    // Join the session
    try {
      // Disable the mic until the bot has joined
      // to avoid interrupting the bot's welcome message
      voiceClient.enableMic(true);
      await voiceClient.startBotAndConnect({
        endpoint,
        requestData: clientParams as any,
      });
    } catch (e) {
      setError((e as RTVIError).message || "Unknown error occured");
      voiceClient.disconnect();
    }
  }

  async function leave() {
    await voiceClient.disconnect();
    window.location.reload();
  }

  /**
   * UI States
   */

  // Error: show full screen message
  if (error) {
    return (
      <Alert intent="danger" title="An error occurred">
        {error}
      </Alert>
    );
  }

  // Connected: show session view
  if (appState === "connected") {
    return (
      <Session
        state={transportState}
        onLeave={() => leave()}
        startAudioOff={startAudioOff}
      />
    );
  }

  // Default: show setup view
  const isReady = appState === "ready";

  return (
    <Card.Card shadow className="animate-appear max-w-lg">
      <Card.CardHeader>
        <Card.CardTitle>Configuration</Card.CardTitle>
      </Card.CardHeader>
      <Card.CardContent stack>
        <div className="flex flex-row gap-2 bg-primary-50 px-4 py-2 md:p-2 text-sm items-center justify-center rounded-md font-medium text-pretty">
          <Ear className="size-7 md:size-5 text-primary-400" />
          Works best in a quiet environment with a good internet.
        </div>
        <Configure
          startAudioOff={startAudioOff}
          handleStartAudioOff={() => setStartAudioOff(!startAudioOff)}
          state={appState}
          disabled={!allowConfigChange}
        />
      </Card.CardContent>
      <Card.CardFooter isButtonArray>
        {allowSave && projectId && (
          <Button key="start" onClick={handleSave}>
            Save
          </Button>
        )}
        <Button key="start" onClick={() => start()} disabled={!isReady}>
          {!isReady && <Loader2 className="animate-spin" />}
          {status_text[transportState as keyof typeof status_text]}
        </Button>
      </Card.CardFooter>
    </Card.Card>
  );
}
