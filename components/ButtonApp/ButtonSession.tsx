import React, { useCallback, useEffect, useState } from "react";
import { Mic } from "lucide-react";
import {
  PipecatMetricsData,
  RTVIEvent,
  TransportState,
} from "@pipecat-ai/client-js";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";
import styled from "@emotion/styled";

import StatsAggregator from "../../utils/stats_aggregator";
import { Button } from "../uiStyled/Button";
import { AudioIndicatorBubble } from "@/components/Session/UserMicBubble";
import Stats from "@/components/Session/Stats";

let stats_aggregator: StatsAggregator;

interface SessionProps {
  state: TransportState;
  onLeave: () => void;
  openMic?: boolean;
  startAudioOff?: boolean;
  connectedComponent?: React.FC<{ onClick: () => void }>;
}

export const ButtonSession = React.memo(
  ({
    state,
    onLeave,
    startAudioOff = false,
    connectedComponent,
  }: SessionProps) => {
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

    const Component = connectedComponent;
    return (
      <>
        {Component ? (
          <Component onClick={onLeave} />
        ) : (
          <Container>
            <AudioIndicatorBubble />
            <StyledButtonWrapper onClick={onLeave}>
              <Button isRound size="icon" variant="ghost">
                <Mic size={16} />
              </Button>
            </StyledButtonWrapper>
          </Container>
        )}
        {showStats && (
          <TTFBContainer>
            <Stats statsAggregator={stats_aggregator} />
          </TTFBContainer>
        )}
      </>
    );
  },
  (p, n) => p.state === n.state
);

const Container = styled.div`
  position: relative;
  width: 3rem;
  height: 3rem;
`;

const StyledButtonWrapper = styled.div`
  margin-left: auto;
  z-index: 1000;
`;

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
