import React, { useCallback } from "react";

import Room from "./Room";
import { useVideoAgentStore } from "./store";
import { useShallow } from "zustand/shallow";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

const RoomWrapper = ({
  width = 270,
  fullScreen = false,
  onLoaded = () => {},
  shadowRoot,
}: {
  width?: number;
  fullScreen?: boolean;
  onLoaded?: (loaded: boolean) => void;
  shadowRoot?: ShadowRoot;
}) => {
  const cache = createCache({
    key: "shadow",
    container: shadowRoot ?? document.head,
  });

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
    <CacheProvider value={cache}>
      {tavusLoaded && callInfo ? (
        <Room width={width} onLeave={handleLeave} fullScreen={fullScreen} />
      ) : null}
    </CacheProvider>
  );
};

export default RoomWrapper;
