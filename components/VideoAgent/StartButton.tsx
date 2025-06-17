import React, { useMemo, useState, useEffect } from "react";

import styled from "@emotion/styled";

import SpinningLoader from "@/components/uiStyled/SpinningLoading";
import { Button } from "@/components/uiStyled/Button";
import { BotMessageSquare } from "lucide-react";
import { useVideoAgentStore } from "./store";
import { useShallow } from "zustand/shallow";

const StartButton = ({
  apiKey,
  agentId,
  baseUrl,
  onLoaded,
  autoJoin = false,
}: {
  apiKey: string;
  agentId: string;
  baseUrl: string;
  onLoaded?: (loaded: boolean) => void;
  autoJoin?: boolean;
}) => {
  const {
    setApiKey,
    setAgentId,
    setBaseUrl,
    setAgentInfo,
    setCallInfo,
    tavusLoaded,
    setTavusLoaded,
  } = useVideoAgentStore(
    useShallow((state) => ({
      apiKey: state.apiKey,
      agentId: state.agentId,
      baseUrl: state.baseUrl,
      setApiKey: state.setApiKey,
      setAgentId: state.setAgentId,
      setBaseUrl: state.setBaseUrl,
      setAgentInfo: state.setAgentInfo,
      setCallInfo: state.setCallInfo,
      tavusLoaded: state.tavusLoaded,
      setTavusLoaded: state.setTavusLoaded,
    }))
  );

  useEffect(() => {
    setApiKey(apiKey);
    setAgentId(agentId);
    setBaseUrl(baseUrl);
  }, [setApiKey, setAgentId, setBaseUrl, apiKey, agentId, baseUrl]);

  const [isLoading, setIsLoading] = useState(false);

  const query = useMemo(() => {
    return `?api_key=${apiKey}&agent_id=${agentId}`;
  }, [apiKey, agentId]);

  useEffect(() => {
    if (!baseUrl || !query) return;
    (async () => {
      const res = await fetch(
        `${baseUrl ?? ""}/api/video-agent/get-agent${query}`
      );
      setAgentInfo(await res.json());
    })();
  }, [baseUrl, query]);

  useEffect(() => {
    if (!autoJoin || !query) return;
    handleJoin();
  }, [autoJoin, query]);

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
        onLoaded?.(true);
      }, 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      {tavusLoaded ? null : isLoading ? (
        <Button key="start" isRound={true} variant="icon" size="icon">
          <SpinningLoader />
        </Button>
      ) : (
        <Button
          key="start"
          isRound={true}
          variant="icon"
          size="icon"
          onClick={handleJoin}
        >
          <BotMessageSquare />
        </Button>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default StartButton;
