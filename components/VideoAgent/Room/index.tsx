import React from "react";

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
}: {
  width: number;
  fullScreen: boolean;
  onLeave: () => void;
}) => {
  const { callInfo } = useVideoAgentStore(
    useShallow((state) => ({
      callInfo: state.callInfo,
    }))
  );

  const callObject = useCallObject({
    options: {
      url: `https://tavus.daily.co/${callInfo!.conversation_id}`,
      userName: "enduser",
      startVideoOff: true,
    },
  });

  return (
    <div className="flex flex-row">
      <DailyProvider callObject={callObject}>
        <DailyAudio />
        {fullScreen ? (
          <FullScreenWrapper onLeave={onLeave} />
        ) : (
          <InlineWrapper width={width} onLeave={onLeave} />
        )}
      </DailyProvider>
    </div>
  );
};

export default Room;
