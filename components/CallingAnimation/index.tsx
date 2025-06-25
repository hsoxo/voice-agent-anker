/** @jsxImportSource @emotion/react */
import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { PhoneCall, PhoneIcon } from "lucide-react";

const ripple = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
`;

const shake = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(4deg); }
  75% { transform: rotate(-4deg); }
`;

const dots = keyframes`
  0% { content: ''; }
  33% { content: '.'; }
  66% { content: '. .'; }
  100% { content: '. . .'; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled.div`
  text-align: center;
  color: rgb(43, 43, 43);
  font-family: sans-serif;
`;

const Center = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
`;

const RippleCircle = styled.div<{ delay: number }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: #28c76f;
  opacity: 0.6;
  animation: ${ripple} 2.4s ease-out infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

const IconCircle = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: #28c76f;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${shake} 1s infinite ease-in-out;
  z-index: 2;
`;

const CallText = styled.div`
  margin-top: 48px;
  font-size: 1.2rem;
`;

const Dots = styled.span`
  &::after {
    display: inline-block;
    white-space: pre;
    content: ".";
    animation: ${dots} 2s steps(3, end) infinite;
  }
`;

export const CallingAnimation: React.FC<{ name?: string }> = ({
  name = "Ethan",
}) => {
  return (
    <Overlay>
      <Container>
        <Center>
          {[0, 0.6, 1.2].map((delay, i) => (
            <RippleCircle key={i} delay={delay} />
          ))}
          <IconCircle>
            <PhoneCall color="white" />
          </IconCircle>
        </Center>
        <CallText>
          Calling {name} <Dots />
        </CallText>
      </Container>
    </Overlay>
  );
};

export default CallingAnimation;
