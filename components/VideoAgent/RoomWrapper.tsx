import React, { useCallback } from "react";

import Room from "./Room";
import { useVideoAgentStore } from "./store";
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

const RoomWrapper = ({
  width = 270,
  onLoaded = () => {},
}: {
  width?: number;
  onLoaded?: (loaded: boolean) => void;
}) => {
  const { callInfo, removeCallInfo, tavusLoaded, setTavusLoaded } =
    useVideoAgentStore(
      useShallow((state) => ({
        callInfo: state.callInfo,
        removeCallInfo: state.removeCallInfo,
        tavusLoaded: state.tavusLoaded,
        setTavusLoaded: state.setTavusLoaded,
      }))
    );

  const handleLeave = useCallback(() => {
    removeCallInfo();
    setTavusLoaded(false);
    onLoaded?.(false);
  }, [removeCallInfo, setTavusLoaded, onLoaded]);

  return (
    <>
      {tavusLoaded && callInfo ? (
        <Room width={width} onLeave={handleLeave} />
      ) : null}
    </>
  );
};

export default RoomWrapper;
