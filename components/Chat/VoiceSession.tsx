import React from "react";
import { VoiceVisualizer } from "realtime-ai-react";
import { AudioIndicatorBubble } from "../Session/UserMicBubble";
import styled from "@emotion/styled";
import VolumeBubble from "./components/VoiceSession/VolumeBubble";
import { Button } from "../uiStyled/Button";
import { Redo2 } from "lucide-react";

const VoiceSession = ({ onClick }: { onClick: () => void }) => {
  return (
    <VoiceSessionWrapper>
      {/* <AudioIndicatorBubble scale={1.1} /> */}
      {/* <div className="bot">
        <VoiceVisualizer participantType="bot" barColor="#eee" />
      </div> */}
      <div className="volume">
        <VolumeBubble />
      </div>
      <Button size="icon" variant="icon" isRound onClick={onClick}>
        <Redo2 />
      </Button>
    </VoiceSessionWrapper>
  );
};

const VoiceSessionWrapper = styled.div`
  width: 460px;
  height: 720px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .volume {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
  .bot {
    z-index: 1;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default VoiceSession;
