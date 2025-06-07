import React, { useCallback, useEffect } from "react";
import { Mic } from "lucide-react";
import {
  PipecatMetricsData,
  RTVIClientConfigOption,
  RTVIEvent,
  TransportState,
} from "realtime-ai";
import { useRTVIClientEvent } from "realtime-ai-react";
import styled from "@emotion/styled";

import StatsAggregator from "../../utils/stats_aggregator";
import { Button } from "./Button";
import { AudioIndicatorBubble } from "@/components/Session/UserMicBubble";

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

    return (
      <Container>
        <AudioIndicatorBubble />
        <StyledButtonWrapper>
          <Button onClick={onLeave} isRound size="icon" variant="ghost">
            <Mic size={16} />
          </Button>
        </StyledButtonWrapper>
      </Container>
    );
  },
  (p, n) => p.state === n.state
);
