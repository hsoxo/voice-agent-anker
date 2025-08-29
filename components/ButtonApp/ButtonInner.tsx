import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { AudioLines } from "lucide-react";
import { RTVIError, RTVIEvent, RTVIMessage } from "@pipecat-ai/client-js";
import {
  usePipecatClient,
  useRTVIClientEvent,
  usePipecatClientTransportState,
} from "@pipecat-ai/client-react";

import { AppContext } from "../context";
import { Alert } from "../ui/alert";
import { Button } from "../uiStyled/Button";
import { MinialConfigure } from "../Setup/MinialConfig";
import { ButtonSession } from "./ButtonSession";
import SpinningLoader from "../uiStyled/SpinningLoading";

export default function ButtonInner({
  setVoiceBotState,
  connectedComponent,
  onLeave,
  error: _error,
}: {
  setVoiceBotState?: (state: string) => void;
  connectedComponent?: React.FC<{ onClick: () => void }>;
  onLeave?: () => void;
  error?: string;
}) {
  const voiceClient = usePipecatClient()!;
  const transportState = usePipecatClientTransportState();

  const [appState, setAppState] = useState<
    "idle" | "ready" | "connecting" | "connected"
  >("idle");
  const [startClicked, setStartClicked] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(false);
  const { clientParams } = useContext(AppContext);
  const [botReady, setBotReady] = useState(false);

  useRTVIClientEvent(
    RTVIEvent.Error,
    useCallback((message: RTVIMessage) => {
      const errorData = message.data as { error: string; fatal: boolean };
      if (!errorData.fatal) return;
      setError(errorData.error);
    }, [])
  );

  useRTVIClientEvent(
    RTVIEvent.BotReady,
    useCallback(() => {
      console.log(`Bot ready`);

      if (!voiceClient) return;
      setBotReady(true);
      return () => {
        setBotReady(false);
      };
    }, [voiceClient])
  );

  useEffect(() => {
    if (!_error) return;
    setError(_error);
  }, [_error]);

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
        setVoiceBotState("ready");
        break;
      case "authenticating":
      case "connecting":
        setAppState("connecting");
        setVoiceBotState("connecting");
        break;
      case "connected":
      case "ready":
        setStartClicked(false);
        setAppState("connected");
        setVoiceBotState("connected");
        break;
      default:
        setAppState("idle");
        setVoiceBotState("idle");
    }
  }, [transportState]);

  async function start() {
    if (!voiceClient) return;
    setStartClicked(true);
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
    voiceClient.enableMic(false);
    await voiceClient.disconnect();
    onLeave?.();
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
  if (appState === "connected" && botReady) {
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
  const isLoading = !botReady;

  return (
    <div>
      {/* <MinialConfigure /> */}
      <Button
        id="voice-start-button"
        onClick={start}
        disabled={!isReady}
        isRound={true}
        variant="icon"
        size="icon"
      >
        {isLoading ? <SpinningLoader /> : <AudioLines />}
      </Button>
      {isLoading && <div>Connecting...</div>}
    </div>
  );
}
