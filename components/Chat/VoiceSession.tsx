import React from "react";
import { VoiceVisualizer } from "realtime-ai-react";
import { AudioIndicatorBubble } from "../Session/UserMicBubble";
import styled from "@emotion/styled";

const VoiceSession = ({ onClick }: { onClick: () => void }) => {
  return (
    <VoiceSessionWrapper onClick={onClick}>
      <AudioIndicatorBubble scale={1.1} />
      <div className="bot">
        <VoiceVisualizer participantType="bot" barColor="#eee" />
      </div>
    </VoiceSessionWrapper>
  );
};

const VoiceSessionWrapper = styled.div`
  width: 368px;
  height: 140px;
  position: relative;

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
