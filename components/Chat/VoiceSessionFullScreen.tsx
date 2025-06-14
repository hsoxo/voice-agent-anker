import React from "react";
import UserMicBubble from "../Session/UserMicBubble";
import Agent from "../Session/Agent";
import styled from "@emotion/styled";
import { Card } from "../uiStyled/Card";

const VoiceSessionFullScreen = ({ onClick }: { onClick: () => void }) => {
  return (
    <VoiceSessionWrapper onClick={onClick}>
      <div className="inner-wrapper">
        <Card fullWidthMobile={false} className="agent-card">
          <Agent isReady={true} onLeave={onClick} />
        </Card>
        <UserMicBubble active={true} muted={false} handleMute={onClick} />
      </div>
    </VoiceSessionWrapper>
  );
};

const VoiceSessionWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);

  .inner-wrapper {
    height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .agent-card {
    margin-top: auto;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  }
`;

export default VoiceSessionFullScreen;
