import React, { useEffect, useState } from "react";

import {
  DailyAudio,
  DailyProvider,
  useCallObject,
} from "@daily-co/daily-react";
import Pusher from "pusher-js";

import FullScreenWrapper from "./FullScreenWrapper";
import { useVideoAgentContext } from "../context";

declare global {
  interface Window {
    pusher?: Pusher;
  }
}

const Room = ({ width, onLeave }: { width: number; onLeave: () => void }) => {
  const {
    callInfo,
    callContext: { showCaption },
  } = useVideoAgentContext();
  const [flexColumn, setFlexColumn] = useState(false);

  useEffect(() => {
    if (showCaption) {
      setFlexColumn(false);
    } else {
      setTimeout(() => {
        setFlexColumn(!showCaption);
      }, 300);
    }
  }, [showCaption]);

  const callObject = useCallObject({
    options: {
      url: `https://tavus.daily.co/${callInfo!.conversation_id}`,
      userName: "enduser",
      startVideoOff: true,
    },
  });

  return (
    <div
      className={"flex " + (flexColumn ? `flex-col ` : "flex-row")}
      style={flexColumn ? { width } : {}}
    >
      <DailyProvider callObject={callObject}>
        <DailyAudio />
        <FullScreenWrapper width={width} onLeave={onLeave} />
      </DailyProvider>
    </div>
  );
};

export default Room;
