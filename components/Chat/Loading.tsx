import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #5b6dfa 0%, #7b61ff 100%);
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;

  &:nth-of-type(1) {
    animation-delay: -0.32s;
  }
  &:nth-of-type(2) {
    animation-delay: -0.16s;
  }
  &:nth-of-type(3) {
    animation-delay: 0s;
  }
`;

const Loading = () => {
  return (
    <LoaderContainer>
      <Dot />
      <Dot />
      <Dot />
    </LoaderContainer>
  );
};

export default Loading;
