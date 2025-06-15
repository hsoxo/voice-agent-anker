import React, { useEffect, useState } from "react";
import VideoAgent from "./VideoAgent";
import { useVideoAgentStore } from "./context";

const VideoAgentIndex = ({
  apiKey,
  agentId,
  baseUrl,
  width = 270,
}: {
  apiKey: string;
  agentId: string;
  baseUrl: string;
  width?: number;
}) => {
  const { setApiKey, setAgentId, setBaseUrl } = useVideoAgentStore();
  const [tavusLoaded, setTavusLoaded] = useState(false);

  useEffect(() => {
    setApiKey(apiKey);
    setAgentId(agentId);
    setBaseUrl(baseUrl);
  }, [setApiKey, setAgentId, setBaseUrl, apiKey, agentId, baseUrl]);

  return (
    <VideoAgent
      tavusLoaded={tavusLoaded}
      setTavusLoaded={setTavusLoaded}
      width={width}
    />
  );
};

export default VideoAgentIndex;
