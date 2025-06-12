import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Loader2, AudioLines } from "lucide-react";
import { RTVIError, RTVIEvent, RTVIMessage } from "realtime-ai";
import {
  useRTVIClient,
  useRTVIClientEvent,
  useRTVIClientTransportState,
} from "realtime-ai-react";

import { AppContext } from "../context";
import { Alert } from "../ui/alert";
import { Button } from "./Button";
import { MinialConfigure } from "../Setup/MinialConfig";
import { ButtonSession } from "./ButtonSession";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 给 Loader2 包一层 styled 组件
const SpinningLoader = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`;

export default function ButtonInner({
  setVoideBotState,
  connectedComponent,
}: {
  setVoideBotState?: (state: string) => void;
  connectedComponent?: React.FC<{ onClick: () => void }>;
}) {
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
        setVoideBotState("ready");
        break;
      case "authenticating":
      case "connecting":
        setAppState("connecting");
        setVoideBotState("connecting");
        break;
      case "connected":
      case "ready":
        setAppState("connected");
        setVoideBotState("connected");
        break;
      default:
        setAppState("idle");
        setVoideBotState("idle");
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
          connectedComponent={connectedComponent}
        />
      </div>
    );
  }

  // Default: show setup view
  const isReady = appState === "ready";

  return (
    <div>
      {/* <MinialConfigure /> */}
      <Button
        key="start"
        onClick={() => start()}
        disabled={!isReady}
        isRound={true}
        variant="icon"
        size="icon"
      >
        {isReady ? <AudioLines /> : <SpinningLoader />}
      </Button>
    </div>
  );
}
