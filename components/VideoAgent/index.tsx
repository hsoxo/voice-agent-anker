import React, { useState } from "react";

import { AgentInfo } from "./types";
import { VideoAgentProvider } from "./context";
import VideoAgent from "./VideoAgent";

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
  const [tavusLoaded, setTavusLoaded] = useState(false);

  return (
    <VideoAgentProvider apiKey={apiKey} agentId={agentId} baseUrl={baseUrl}>
      <VideoAgent
        tavusLoaded={tavusLoaded}
        setTavusLoaded={setTavusLoaded}
        width={width}
      />
    </VideoAgentProvider>
  );
};

export default VideoAgentIndex;
