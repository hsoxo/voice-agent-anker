import React from "react";

import {
  DailyAudio,
  DailyProvider,
  useCallObject,
} from "@daily-co/daily-react";
import Pusher from "pusher-js";

import FullScreenWrapper from "./FullScreenWrapper";
import { useVideoAgentStore } from "../context";
import { useShallow } from "zustand/shallow";

declare global {
  interface Window {
    pusher?: Pusher;
  }
}

const Room = ({ width, onLeave }: { width: number; onLeave: () => void }) => {
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
    <DailyProvider callObject={callObject}>
      <DailyAudio />
      <FullScreenWrapper onLeave={onLeave} />
    </DailyProvider>
  );
};

export default Room;
