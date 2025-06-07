import { Loader2, Mic } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RTVIError, RTVIEvent, RTVIMessage } from "realtime-ai";
import {
  useRTVIClient,
  useRTVIClientEvent,
  useRTVIClientTransportState,
} from "realtime-ai-react";

import { AppContext } from "../context";
import { Alert } from "../ui/alert";
import { Button } from "./Button";
import { MinialConfigure } from '../Setup/MinialConfig'
import {ButtonSession} from "../Session/ButtonSession";

export default function ButtonInner() {
  const voiceClient = useRTVIClient()!;
  const transportState = useRTVIClientTransportState();

  const [appState, setAppState] = useState<
    "idle" | "ready" | "connecting" | "connected"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(false);
  const { clientParams } = useContext(AppContext);

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
    voiceClient.params = {
      ...voiceClient.params,
      requestData: {
        ...voiceClient.params.requestData,
        ...clientParams,
      },
    };
  }, [voiceClient, appState, clientParams]);

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
      await voiceClient.connect();
    } catch (e) {
      setError((e as RTVIError).message || "Unknown error occured");
      voiceClient.disconnect();
    }
  }

  async function leave() {
    await voiceClient.disconnect();
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
      <div>
        <ButtonSession
          state={transportState}
          onLeave={() => leave()}
          startAudioOff={startAudioOff}
        />
      </div>
    );
  }

  // Default: show setup view
  const isReady = appState === "ready";

  return (
    <div>
        {/* <MinialConfigure /> */}
        <Button key="start" onClick={() => start()} disabled={!isReady} isRound={true} size="icon">
          {isReady ? <Mic /> : <Loader2 className="animate-spin" />}
        </Button>
    </div>
  );
}
