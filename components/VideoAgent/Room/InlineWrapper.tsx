import React, { useCallback, useEffect, useState } from "react";

import { useDaily } from "@daily-co/daily-react";
import styled from "@emotion/styled";

import Agent from "./Agent";
import Controllers from "./Controllers";
import { useVideoAgentStore } from "../store";
import { useShallow } from "zustand/shallow";
import BeatLoader from "@/components/uiStyled/BeatLoading";

const InlineWrapper = ({
  width,
  onLeave,
  shadowRoot,
}: {
  width: number;
  onLeave: () => void;
  shadowRoot?: ShadowRoot;
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
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

  const height = width * 1.77;
  return (
    <Wrapper>
      <div className="agent-container" style={{ width, height }}>
        {videoLoaded ? (
          <Agent width={width} height={height} shadowRoot={shadowRoot} />
        ) : (
          <div className="loading" style={{ height, width }}>
            <BeatLoader />
          </div>
        )}
      </div>
      <div className="controllers-container" style={{ width }}>
        <Controllers onLeave={handleLeave} />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  .controllers-container {
    .inner {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }
  }
  .agent-container {
    position: relative;
    backdrop-filter: blur(4px);
    .loading {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export default InlineWrapper;
