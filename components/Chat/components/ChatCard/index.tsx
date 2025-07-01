import React from "react";
import styled from "@emotion/styled";
import Header from "./Header";
import Bubble from "./Bubble";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loading from "../Loading";
import { Chat } from "../../types";
import { Button } from "@/components/uiStyled/Button";
import { AudioLines, BotMessageSquare } from "lucide-react";
import FollowUpQuestions from "../FollowUpQuestions";

const ChatCard = ({
  handleClose,
  chats,
  isBotLoading,
  text,
  setText,
  followUpQuestions,
  handleSend,
  handleStartVoiceAgent,
  handleStartVideoAgent,
}: {
  handleClose: () => void;
  chats: Chat[];
  isBotLoading: boolean;
  text: string;
  setText: (text: string) => void;
  followUpQuestions: string[];
  handleSend: () => void;
  handleStartVoiceAgent: () => void;
  handleStartVideoAgent: () => void;
}) => {
  return (
    <>
      <Header handleClose={handleClose} />
      <BubbleWrapper>
        {chats.map((chat, index) => (
          <Bubble
            key={index}
            text={chat.text}
            time={chat.time}
            role={chat.role}
          />
        ))}
        {isBotLoading && <Bubble text={<Loading />} role="ai" />}
        <div style={{ margin: "12px" }}>
          <FollowUpQuestions show={true} handleSend={handleSend}/>
        </div>
        <div id="bubble-bottom" />
      </BubbleWrapper>
      <InputWrapper>
        <div>
          <input
            style={{ width: 330 }}
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <div style={{ width: 2, height: 30, background: "#eee" }} />
          <Tooltip>
            <TooltipTrigger>
              <Button
                key="start"
                isRound={true}
                variant="icon"
                size="icon"
                onClick={handleStartVideoAgent}
              >
                <BotMessageSquare />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Talk with video agent</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                key="start"
                isRound={true}
                variant="icon"
                size="icon"
                onClick={handleStartVoiceAgent}
              >
                <AudioLines />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Talk with agent</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </InputWrapper>
    </>
  );
};

const InputWrapper = styled.div`
  position: absolute;
  bottom: 0;
  padding: 16px;
  width: 440px;
  > div {
    border-radius: 30px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    gap: 4px;
    padding: 4px 4px 4px 16px;
    min-height: 56px;
  }

  input {
    width: 100%;
    border-radius: 4px;
    border: none;
    outline: none;
    transition: width 0.3s ease;
  }
`;

const BubbleWrapper = styled.div`
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100% - 140px);
`;

export default ChatCard;
