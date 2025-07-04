import React, { Suspense } from "react";

import {
  DailyAudio,
  DailyProvider,
  useCallObject,
} from "@daily-co/daily-react";

import FullScreenWrapper from "./FullScreenWrapper";
import InlineWrapper from "./InlineWrapper";
import { useVideoAgentStore } from "../store";
import { useShallow } from "zustand/shallow";

const Room = ({
  width,
  fullScreen,
  onLeave,
  shadowRoot,
}: {
  width: number;
  fullScreen: boolean;
  onLeave: () => void;
  shadowRoot?: ShadowRoot;
}) => {
  const { callInfo, agentVideoLoaded } = useVideoAgentStore(
    useShallow((state) => ({
      callInfo: state.callInfo,
      agentVideoLoaded: state.agentVideoLoaded,
    }))
  );

  const callObject = useCallObject({
    options: {
      url: `https://tavus.daily.co/${callInfo!.conversation_id}`,
      userName: "enduser",
      // startVideoOff: true,
    },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className="flex flex-row"
        style={{
          visibility: agentVideoLoaded ? "visible" : "hidden",
        }}
      >
        <DailyProvider callObject={callObject}>
          <DailyAudio />
          {fullScreen ? (
            <FullScreenWrapper onLeave={onLeave} shadowRoot={shadowRoot} />
          ) : (
            <InlineWrapper
              width={width}
              onLeave={onLeave}
              shadowRoot={shadowRoot}
            />
          )}
        </DailyProvider>
      </div>
    </Suspense>
  );
};

export default Room;
