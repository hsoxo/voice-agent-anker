import React, { useState } from "react";
import styled from "@emotion/styled";

const CardWrapper = styled.div`
  perspective: 3000px;
  width: 300px;
  height: 200px;
`;

const CardInner = styled.div<{ flipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${({ flipped }) => (flipped ? "rotateY(180deg)" : "none")};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border: 1px solid #ccc;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardFront = styled(CardFace)`
  background-color: #f9f9f9;
`;

const CardBack = styled(CardFace)`
  background-color: #e0e0ff;
  transform: rotateY(180deg);
`;

const FlipButton = styled.button`
  margin-top: 16px;
`;

export const FlipCard = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div>
      <CardWrapper>
        <CardInner flipped={flipped}>
          <CardFront>我是正面</CardFront>
          <CardBack>我是背面</CardBack>
        </CardInner>
      </CardWrapper>
      <FlipButton onClick={() => setFlipped(!flipped)}>点击翻转</FlipButton>
    </div>
  );
};
