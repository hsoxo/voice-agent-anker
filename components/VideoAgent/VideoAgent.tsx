import React, { useCallback, useState, useEffect } from "react";

import styled from "@emotion/styled";

import { useVideoAgentContext, VideoAgentProvider } from "./context";
import SpinningLoader from "@/components/uiStyled/SpinningLoading";
import { Button } from "@/components/uiStyled/Button";
import { AudioLines } from "lucide-react";
import Room from "./Room";

declare global {
  interface Window {
    NEWCAST_CONFIG: {
      baseUrl: string;
      agentId: string;
      apiKey: string;
    };
  }
}

const TavusIntegration = ({
  tavusLoaded,
  setTavusLoaded,
  width = 270,
}: {
  tavusLoaded: boolean;
  setTavusLoaded: (loaded: boolean) => void;
  width: number;
}) => {
  const {
    query,
    apiKey,
    agentId,
    baseUrl,
    callInfo,
    setCallInfo,
    removeCallInfo,
    setAgentInfo,
  } = useVideoAgentContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${baseUrl}/api/video-agent/get-agent${query}`);
      setAgentInfo(await res.json());
    })();
  }, [agentId, apiKey, baseUrl]);

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/video-agent/create-session${query}`,
        {
          method: "POST",
        }
      );
      const callInfo = await res.json();
      setCallInfo(callInfo);
      setTimeout(() => {
        setTavusLoaded(true);
      }, 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = useCallback(() => {
    removeCallInfo();
    setTavusLoaded(false);
  }, [removeCallInfo, setTavusLoaded]);

  return (
    <VideoAgentProvider>
      <Wrapper>
        {tavusLoaded ? null : isLoading ? (
          <SpinningLoader />
        ) : (
          <Button
            key="start"
            isRound={true}
            variant="icon"
            size="icon"
            onClick={handleJoin}
          >
            <AudioLines />
          </Button>
        )}
      </Wrapper>
      {tavusLoaded && callInfo ? (
        <Room width={width} onLeave={handleLeave} />
      ) : null}
    </VideoAgentProvider>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default TavusIntegration;
