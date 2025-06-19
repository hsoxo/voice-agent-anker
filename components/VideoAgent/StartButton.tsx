import React, { useMemo, useState, useEffect } from "react";

import styled from "@emotion/styled";

import SpinningLoader from "@/components/uiStyled/SpinningLoading";
import { Button } from "@/components/uiStyled/Button";
import { BotMessageSquare } from "lucide-react";
import { useVideoAgentStore } from "./store";
import { useShallow } from "zustand/shallow";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import LocalCameraFeed from "./Room/LocalCameraFeed";

const HOST = process.env.NEXT_PUBLIC_WEB_URL ?? "";

const StartButton = ({
  apiKey,
  agentId,
  chatId = "",
  llmUrl = "",
  requestTemplate = null,
  onLoaded,
  autoJoin = false,
  shadowRoot,
}: {
  apiKey?: string;
  agentId?: string;
  chatId?: string;
  llmUrl?: string;
  requestTemplate?: any;
  onLoaded?: (loaded: boolean) => void;
  autoJoin?: boolean;
  shadowRoot?: ShadowRoot;
}) => {
  const cache = createCache({
    key: "shadow",
    container:
      shadowRoot ??
      document.querySelector("shulex-chatbot-lancher")?.shadowRoot ??
      document.head,
  });

  const {
    setApiKey,
    setAgentId,
    setAgentInfo,
    setCallInfo,
    tavusLoaded,
    setTavusLoaded,
  } = useVideoAgentStore(
    useShallow((state) => ({
      apiKey: state.apiKey,
      agentId: state.agentId,
      setApiKey: state.setApiKey,
      setAgentId: state.setAgentId,
      setAgentInfo: state.setAgentInfo,
      setCallInfo: state.setCallInfo,
      tavusLoaded: state.tavusLoaded,
      setTavusLoaded: state.setTavusLoaded,
    }))
  );

  useEffect(() => {
    setApiKey(apiKey);
    setAgentId(agentId);
  }, [setApiKey, setAgentId, apiKey, agentId]);

  const [isLoading, setIsLoading] = useState(false);

  const query = useMemo(() => {
    return `?api_key=${apiKey}&agent_id=${agentId}`;
  }, [apiKey, agentId]);

  useEffect(() => {
    if (!query) return;
    (async () => {
      const res = await fetch(`${HOST}/api/video-agent/get-agent${query}`);
      setAgentInfo(await res.json());
    })();
  }, [query]);

  useEffect(() => {
    if (!autoJoin || !query) return;
    handleJoin();
  }, [autoJoin, query]);

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${HOST}/api/video-agent/create-session${query}`,
        { method: "POST" }
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
    <CacheProvider value={cache}>
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
    </CacheProvider>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default StartButton;
