import React from "react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import FadeInContainer from "../FadeInContainer";
import { Buttons } from "../Buttons";

type BubbleProps = {
  text: string | React.ReactNode;
  time?: string;
  role: "ai" | "user";
  position: number;
};

const Bubble: React.FC<BubbleProps> = ({ text, time, role, position }) => {
  return (
    <FadeInContainer>
      <BubbleContainer role={role}>
        <BubbleText>{text}</BubbleText>
      </BubbleContainer>
      <Buttons show={role === "ai"} position={position} />
      {time && (
        <BubbleTime role={role}>{dayjs(time).format("HH:mm")}</BubbleTime>
      )}
    </FadeInContainer>
  );
};

const BubbleContainer = styled.div<{ role: "ai" | "user" }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ role }) => (role === "ai" ? "flex-start" : "flex-end")};
  margin-right: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(242, 243, 255, 0.6);
  color: #333;
  max-width: 80%;
  width: fit-content;
  margin-left: ${({ role }) => (role === "user" ? "auto" : "10px")};
  text-align: left;
`;

const BubbleText = styled.span`
  font-size: 16px;
  line-height: 1.5;
`;

const BubbleTime = styled.span<{ role: "ai" | "user" }>`
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  padding: 0 16px;
  align-self: ${({ role }) => (role === "ai" ? "flex-start" : "flex-end")};
`;

export default Bubble;
