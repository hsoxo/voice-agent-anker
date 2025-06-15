import React, { useCallback, useMemo, useState, useEffect } from "react";

import styled from "@emotion/styled";

import SpinningLoader from "@/components/uiStyled/SpinningLoading";
import { Button } from "@/components/uiStyled/Button";
import { AudioLines } from "lucide-react";
import Room from "./Room";
import { useVideoAgentStore } from "./context";
import { useShallow } from "zustand/shallow";

declare global {
  interface Window {
    NEWCAST_CONFIG: {
      baseUrl: string;
      agentId: string;
      apiKey: string;
    };
  }
}

const VideoAgent = ({
  tavusLoaded,
  setTavusLoaded,
  width = 270,
}: {
  tavusLoaded: boolean;
  setTavusLoaded: (loaded: boolean) => void;
  width: number;
}) => {
  const {
    apiKey,
    agentId,
    baseUrl,
    setAgentInfo,
    callInfo,
    setCallInfo,
    removeCallInfo,
  } = useVideoAgentStore(
    useShallow((state) => ({
      apiKey: state.apiKey,
      agentId: state.agentId,
      baseUrl: state.baseUrl,
      setAgentInfo: state.setAgentInfo,
      setCallInfo: state.setCallInfo,
      removeCallInfo: state.removeCallInfo,
      callInfo: state.callInfo,
    }))
  );

  const [isLoading, setIsLoading] = useState(false);

  const query = useMemo(() => {
    let query = window.location.search;
    if (!query) {
      query = `?api_key=${apiKey}&agent_id=${agentId}`;
    }
    return query;
  }, [apiKey, agentId]);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${baseUrl ?? ""}/api/video-agent/get-agent${query}`
      );
      setAgentInfo(await res.json());
    })();
  }, [baseUrl]);

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
    <>
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
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default VideoAgent;
