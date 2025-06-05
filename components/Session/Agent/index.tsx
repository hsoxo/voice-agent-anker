import React, { memo, useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { RTVIEvent } from "realtime-ai";
import { useRTVIClientEvent, VoiceVisualizer } from "realtime-ai-react";

export const Agent = memo(
  ({ isReady, statsAggregator, onLeave }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [botStatus, setBotStatus] = useState("initializing");
    const [botIsTalking, setBotIsTalking] = useState(false);

    useEffect(() => {
      if (!isReady) return;
      setHasStarted(true);
      setBotStatus("connected");
    }, [isReady]);

    useRTVIClientEvent(
      RTVIEvent.BotDisconnected,
      useCallback(() => {
        setHasStarted(false);
        setBotStatus("disconnected");
        onLeave();
      }, [onLeave])
    );

    useRTVIClientEvent(
      RTVIEvent.BotStartedSpeaking,
      useCallback(() => {
        setBotIsTalking(true);
      }, [])
    );

    useRTVIClientEvent(
      RTVIEvent.BotStoppedSpeaking,
      useCallback(() => {
        setBotIsTalking(false);
      }, [])
    );

    useEffect(() => () => setHasStarted(false), []);

    return (
      <div className="p-2 relative">
        <div
          className={`min-w-[400px] aspect-square rounded-2xl relative flex items-center justify-center overflow-hidden transition-colors duration-1000
            ${hasStarted ? "bg-gray-600" : "bg-primary-300"}
            ${botIsTalking ? "bg-primary-950" : ""}
            max-md:min-w-0`}
        >
          {!hasStarted ? (
            <span className="p-3 inline-block leading-none bg-primary-600 text-white rounded-full absolute">
              <Loader2 size={32} className="animate-spin" />
            </span>
          ) : (
            <VoiceVisualizer participantType="bot" barColor="#FFFFFF" />
          )}
        </div>
      </div>
    );
  },
  (prev, next) => prev.isReady === next.isReady
);

Agent.displayName = "Agent";
export default Agent;
