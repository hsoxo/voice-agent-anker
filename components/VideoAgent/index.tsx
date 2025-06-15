import React, { useEffect, useState } from "react";
import VideoAgent from "./VideoAgent";
import { useVideoAgentStore } from "./context";

const VideoAgentIndex = ({
  apiKey,
  agentId,
  baseUrl,
  width = 270,
  setVideoBotLoaded,
}: {
  apiKey: string;
  agentId: string;
  baseUrl: string;
  width?: number;
  setVideoBotLoaded?: (loaded: boolean) => void;
}) => {
  const { setApiKey, setAgentId, setBaseUrl } = useVideoAgentStore();
  const [tavusLoaded, setTavusLoaded] = useState(false);

  useEffect(() => {
    setApiKey(apiKey);
    setAgentId(agentId);
    setBaseUrl(baseUrl);
  }, [setApiKey, setAgentId, setBaseUrl, apiKey, agentId, baseUrl]);

  const handleTavusLoaded = () => {
    setTavusLoaded(true);
    setVideoBotLoaded?.(true);
  };

  return (
    <VideoAgent
      tavusLoaded={tavusLoaded}
      setTavusLoaded={handleTavusLoaded}
      width={width}
    />
  );
};

export default VideoAgentIndex;
