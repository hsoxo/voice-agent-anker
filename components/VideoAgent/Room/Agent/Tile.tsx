import React from "react";

import { useParticipantProperty } from "@daily-co/daily-react";

import { DailyVideo } from "./DailyVideo";

const Tile = ({
  width,
  height,
  id,
  shadowRoot,
}: {
  width: number;
  height?: number;
  id: string;
  shadowRoot?: ShadowRoot;
}) => {
  const username = useParticipantProperty(id, "user_name");

  if (!username) return null;
  return (
    <DailyVideo
      automirror
      width={width}
      height={height}
      sessionId={id}
      type="video"
      style={{ maxWidth: "unset", margin: "auto" }}
      className="rounded-2xl"
    />
  );
};

export default Tile;
