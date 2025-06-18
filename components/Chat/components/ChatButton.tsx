import React from "react";
import { MessageSquare, SendHorizonal } from "lucide-react";
import styled from "@emotion/styled";
import { Button } from "../../ui/button";

const ChatButton = ({
  open,
  handler,
}: {
  open: boolean;
  handler: () => void;
}) => {
  return (
    <SendButton>
      <Button onClick={handler} isRound size="icon">
        {open ? <SendHorizonal /> : <MessageSquare />}
      </Button>
    </SendButton>
  );
};

const SendButton = styled.div`
  position: absolute;
  right: -16px;
  bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  z-index: 1001;
  border-radius: 50%;
  button {
    background: linear-gradient(
      145.55deg,
      rgb(95, 88, 255) -12.97%,
      rgb(172, 0, 216) 103.71%
    );
    border: none;
    flex-shrink: 0;
  }
`;

export default ChatButton;
