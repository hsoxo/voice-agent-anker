import React from "react";
import styled from "@emotion/styled";
import VolumeBubble from "./components/VoiceSession/VolumeBubble";
import { Button } from "../uiStyled/Button";
import { MicOff, Mic, LogOut, UserRound } from "lucide-react";
import { useRTVIClient } from "@pipecat-ai/client-react";
import { useState } from "react";
import Logo from "@/assets/icons/logo-dark.svg";
import Image from "next/image";
import FollowUpQuestions from "./components/FollowUpQuestions";
import { useChatStore } from "./store";
import { useShallow } from "zustand/shallow";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { LastestButtons } from "./components/Buttons/LastestButtons";

const VoiceSession = ({ onClick }: { onClick: () => void }) => {
  const { followUpQuestions } = useChatStore(
    useShallow((state) => ({
      followUpQuestions: state.followUpQuestions,
    }))
  );
  const voiceClient = useRTVIClient()!;
  const [muted, setMuted] = useState(false);
  function toggleMute() {
    voiceClient.enableMic(muted);
    setMuted(!muted);
  }
  const handleSend = (text: string) => {
    console.log(
      (voiceClient.transport as DailyTransport).dailyCallClient.sendAppMessage
    );
    (voiceClient.transport as DailyTransport).dailyCallClient?.sendAppMessage(
      {
        message: text,
      },
      "*"
    );
  };
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
        {followUpQuestions.length > 0 && (
          <div style={{ width: "100%", padding: "12px 12px 0 12px" }}>
            <FollowUpQuestions show={true} handleSend={handleSend} />
          </div>
        )}
        <LastestButtons show={true} />
        <div className="buttons">
          <Button
            isRound={true}
            variant="icon"
            size="icon"
            onClick={toggleMute}
          >
            {muted ? <MicOff /> : <Mic />}
          </Button>
          <Button isRound={true} variant="danger" size="icon" onClick={onClick}>
            <LogOut />
          </Button>
        </div>
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
    height: 40%;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    flex-direction: column;
    .buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }
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
