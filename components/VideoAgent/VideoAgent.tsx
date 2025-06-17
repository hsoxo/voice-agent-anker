import React, { useCallback, useMemo, useState, useEffect } from "react";

import RoomWrapper from "./RoomWrapper";
import StartButton from "./StartButton";

const VideoAgent = ({
  apiKey,
  agentId,
  onLoaded,
  width = 270,
}: {
  apiKey: string;
  agentId: string;
  onLoaded?: (loaded: boolean) => void;
  width?: number;
}) => {
  return (
    <>
      <RoomWrapper onLoaded={onLoaded} width={width} fullScreen />
      <StartButton apiKey={apiKey} agentId={agentId} onLoaded={onLoaded} />
    </>
  );
};

export default VideoAgent;
