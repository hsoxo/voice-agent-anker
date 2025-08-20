"use client";

import { Ear, Loader2 } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RTVIError, RTVIEvent, RTVIMessage } from "@pipecat-ai/client-js";
import {
  useRTVIClient,
  useRTVIClientEvent,
  useRTVIClientTransportState,
} from "@pipecat-ai/client-react";

import { AppContext } from "../context";
import Session from "../Session";
import { Configure } from "../Setup";
import { Alert } from "../ui/alert";
import { Button } from "../ui/button";
import * as Card from "../ui/card";
import { toast } from "sonner";
import { updateProjectCallSettings } from "@/services/projects";

const status_text = {
  idle: "Initializing...",
  initialized: "Start",
  authenticating: "Requesting bot...",
  connecting: "Connecting...",
  disconnected: "Start",
};

export default function App({ projectId = null }: { projectId?: string }) {
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
    window.location.reload();
  }

  useEffect(() => {
    start();
  }, []);
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
    <Button key="start" onClick={() => start()} disabled={!isReady}>
      {!isReady && <Loader2 className="animate-spin" />}
      {status_text[transportState as keyof typeof status_text]}
    </Button>
  );
}
