import React from 'react';
import styled from '@emotion/styled';

type BubbleProps = {
  text: string;
  time: string;
  role: 'ai' | 'user';
};

const Bubble: React.FC<BubbleProps> = ({ text, time, role }) => {
  return (
    <BubbleContainer role={role}>
      <BubbleText>{text}</BubbleText>
    </BubbleContainer>
  );
};

const BubbleContainer = styled.div<{ role: 'ai' | 'user' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ role }) => (role === 'ai' ? 'flex-start' : 'flex-end')};
  margin-right: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ role }) => (role === 'ai' ? '#f5f5f5' : '#34C759')};
  color: ${({ role }) => (role === 'ai' ? '#333' : '#fff')};
  max-width: 80%;
  width: fit-content;
  margin-left: ${({ role }) => (role === 'user' ? 'auto' : '10px')};
`;

const BubbleText = styled.span`
  font-size: 16px;
  line-height: 1.5;
`;

const BubbleTime = styled.span`
  font-size: 12px;
  color: #999;
`;

export default Bubble;
