import { Loader2 } from "lucide-react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 给 Loader2 包一层 styled 组件
const SpinningLoader = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`;

export default SpinningLoader;
