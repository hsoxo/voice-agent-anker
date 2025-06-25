import React from "react";
import styled from "@emotion/styled";
import VolumeBubble from "./components/VoiceSession/VolumeBubble";
import { Button } from "../uiStyled/Button";
import { MicOff, Mic, LogOut, UserRound } from "lucide-react";
import { useRTVIClient } from "@pipecat-ai/client-react";
import { useState } from "react";
import Logo from "@/assets/icons/logo-dark.svg";
import Image from "next/image";

const VoiceSession = ({ onClick }: { onClick: () => void }) => {
  const voiceClient = useRTVIClient()!;
  const [muted, setMuted] = useState(false);
  function toggleMute() {
    voiceClient.enableMic(muted);
    setMuted(!muted);
  }
  return (
    <VoiceSessionWrapper>
      <div className="volume">
        <VolumeBubble muted={muted} />
      </div>
      <div className="top">
        <div className="header">
          <div className="left">
            <div className="avatar">
              <UserRound />
            </div>
            <div>
              <div style={{ fontWeight: "bold" }}>Agent</div>
              <div
                style={{
                  color: "#999",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div id="dot" />
                Online
              </div>
            </div>
          </div>
          <div className="right">
            <div
              style={{ fontWeight: "bold", fontSize: "10px", color: "#999" }}
            >
              Powered by:
            </div>
            <Image src={Logo} width={100} alt="alt" />
          </div>
        </div>
      </div>
      <div className="controls">
        <Button isRound={true} variant="icon" size="icon" onClick={toggleMute}>
          {muted ? <MicOff /> : <Mic />}
        </Button>
        <Button isRound={true} variant="danger" size="icon" onClick={onClick}>
          <LogOut />
        </Button>
      </div>
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
  flex-direction: column;
  overflow: hidden;
  border-radius: 28px;
  .volume {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
  .top {
    height: 70%;
    z-index: 1;
  }
  .controls {
    height: 30%;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    width: 460px;
    padding: 2rem;
    .left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #eee;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgb(113, 255, 113);
    }
  }
`;

export default VoiceSession;
