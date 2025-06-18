import React, { useCallback, useEffect, useState } from "react";

import { useDaily } from "@daily-co/daily-react";
import styled from "@emotion/styled";

import { useWindowSize } from "@/hooks/useWindowSize";

import Agent from "./Agent";
import Controllers from "./Controllers";
import { useVideoAgentStore } from "../store";
import { useShallow } from "zustand/shallow";
import BeatLoader from "@/components/uiStyled/BeatLoading";

const FullScreenWrapper = ({
  onLeave,
  shadowRoot,
}: {
  onLeave: () => void;
  shadowRoot?: ShadowRoot;
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [screenHeight, screenWidth] = useWindowSize();
  const callObject = useDaily();
  const resetCallContext = useVideoAgentStore(
    useShallow((state) => state.resetCallContext)
  );

  useEffect(() => {
    if (!callObject) return;
    (async () => {
      if (!callObject.callClientId) return;
      callObject.on("left-meeting", onLeave);
      callObject.on("participant-joined", (event) => {
        if (event.participant.tracks.video.state === "playable") {
          setVideoLoaded(true);
        }
      });
      callObject.on("participant-updated", (event) => {
        if (event.participant.tracks.video.state === "playable") {
          setVideoLoaded(true);
        }
      });
      await callObject.join();
    })();
    const cleanup = () => {
      if (callObject) {
        callObject.leave();
        callObject.destroy();
      }
    };
    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [callObject, onLeave]);

  const handleLeave = useCallback(() => {
    callObject?.leave();
    callObject?.destroy();
    resetCallContext();
    onLeave();
  }, [callObject, resetCallContext, onLeave]);

  return (
    <Wrapper>
      <div className="controllers-container">
        <Controllers onLeave={handleLeave} />
      </div>

      <div className={`w-screen h-screen relative backdrop-blur-sm`}>
        {videoLoaded ? (
          <Agent
            width={screenWidth}
            height={screenHeight}
            shadowRoot={shadowRoot}
          />
        ) : (
          <div
            className="flex items-center justify-center"
            style={{ height: screenHeight, width: screenWidth }}
          >
            <BeatLoader />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  backdrop-filter: blur(4px);
  .text-content-full-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .controllers-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000000;
    .inner {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  }
`;

export default FullScreenWrapper;
