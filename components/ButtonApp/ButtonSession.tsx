import React, { useCallback, useEffect, useState } from "react";
import { Mic } from "lucide-react";
import { PipecatMetricsData, RTVIEvent, TransportState } from "realtime-ai";
import { useRTVIClientEvent } from "realtime-ai-react";
import styled from "@emotion/styled";

import StatsAggregator from "../../utils/stats_aggregator";
import { Button } from "./Button";
import { AudioIndicatorBubble } from "@/components/Session/UserMicBubble";
import Stats from "@/components/Session/Stats";

let stats_aggregator: StatsAggregator;

interface SessionProps {
  state: TransportState;
  onLeave: () => void;
  openMic?: boolean;
  startAudioOff?: boolean;
}

const Container = styled.div`
  position: relative;
  width: 3rem; /* w-12 */
  height: 3rem; /* h-12 */
  border: 1px solid #e5e7eb; /* default border color, adjust if themed */
  border-radius: 9999px; /* rounded-full */
`;

const StyledButtonWrapper = styled.div`
  margin-left: auto;
  z-index: 1000;
`;

export const ButtonSession = React.memo(
  ({ state, onLeave, startAudioOff = false }: SessionProps) => {
    const [showStats, setShowStats] = useState(false);
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
      stats_aggregator = new StatsAggregator();
    }, []);

    useEffect(() => {
      if (state === "error") {
        onLeave();
      }
    }, [state, onLeave]);

    useEffect(() => {
      setTimeout(
        () => setShowStats(window.location.search.includes("showStats=true")),
        500
      );
    }, []);

    return (
      <Container>
        <AudioIndicatorBubble />
        <StyledButtonWrapper>
          <Button onClick={onLeave} isRound size="icon" variant="ghost">
            <Mic size={16} />
          </Button>
        </StyledButtonWrapper>
        {showStats && (
          <TTFBContainer>
            <Stats statsAggregator={stats_aggregator} />
          </TTFBContainer>
        )}
      </Container>
    );
  },
  (p, n) => p.state === n.state
);

const TTFBContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: fit-content;
  height: fit-content;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;
