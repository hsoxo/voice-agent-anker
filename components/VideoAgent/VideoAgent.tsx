import React, { useCallback, useMemo, useState, useEffect } from "react";

import RoomWrapper from "./RoomWrapper";
import StartButton from "./StartButton";

const VideoAgent = ({
  apiKey,
  agentId,
  baseUrl,
  onLoaded,
  width = 270,
}: {
  apiKey: string;
  agentId: string;
  baseUrl: string;
  onLoaded?: (loaded: boolean) => void;
  width?: number;
}) => {
  return (
    <>
      <RoomWrapper onLoaded={onLoaded} width={width} fullScreen />
      <StartButton
        apiKey={apiKey}
        agentId={agentId}
        baseUrl={baseUrl}
        onLoaded={onLoaded}
      />
    </>
  );
};

export default VideoAgent;
