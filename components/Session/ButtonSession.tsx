import { Mic } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  PipecatMetricsData,
  RTVIClientConfigOption,
  RTVIEvent,
  TransportState,
} from "realtime-ai";
import { useRTVIClient, useRTVIClientEvent } from "realtime-ai-react";

import StatsAggregator from "../../utils/stats_aggregator";
import { Button } from "../ui/button";

import {AudioIndicatorBubble} from "./UserMicBubble";

let stats_aggregator: StatsAggregator;

interface SessionProps {
  state: TransportState;
  onLeave: () => void;
  openMic?: boolean;
  startAudioOff?: boolean;
}

export const ButtonSession = React.memo(
  ({ state, onLeave, startAudioOff = false }: SessionProps) => {
    // ---- Voice Client Events

    useRTVIClientEvent(
      RTVIEvent.Metrics,
      useCallback((metrics: PipecatMetricsData) => {
        metrics?.ttfb?.map((m: { processor: string; value: number }) => {
          stats_aggregator.addStat([m.processor, "ttfb", m.value, Date.now()]);
        });
      }, [])
    );

    // ---- Effects
    useEffect(() => {
      // Create new stats aggregator on mount (removes stats from previous session)
      stats_aggregator = new StatsAggregator();
    }, []);

    useEffect(() => {
      // Leave the meeting if there is an error
      if (state === "error") {
        onLeave();
      }
    }, [state, onLeave]);

    return (
      <div className="relative w-12 h-12 border rounded-full">
        <AudioIndicatorBubble />  
        <Button onClick={() => onLeave()} className="ml-auto z-1000" isRound size="icon" variant="ghost">
          <Mic size={16} />
        </Button>
      </div>
    );
  },
  (p, n) => p.state === n.state
);
