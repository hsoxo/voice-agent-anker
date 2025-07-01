import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const fadeSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FadeInContainer = styled.div`
  animation: ${fadeSlideIn} 0.4s ease-in-out;
  display: flex;
  flex-direction: column;
`;

export default FadeInContainer;
