import React from "react";
import styled from "@emotion/styled";
import { Button } from "@/components/uiStyled/Button";
import { SendHorizonal } from "lucide-react";
import FadeInContainer from "../FadeInContainer";
import { useChatStore } from "../../store";
import { useShallow } from "zustand/shallow";

const FollowUpQuestions = ({
  show,
  handleSend,
}: {
  show: boolean;
  handleSend: (text: string) => void;
}) => {
  const { followUpQuestions: questions } = useChatStore(
    useShallow((state) => ({
      followUpQuestions: state.followUpQuestions,
    }))
  );

  if (!show) return null;
  return (
    <Container>
      {questions.map((question, index) => (
        <FadeInContainer key={index}>
          <Bubble>
            <span>{question}</span>
            <Button
              variant="icon"
              size="iconSm"
              onClick={() => handleSend(question)}
            >
              <SendHorizonal />
            </Button>
          </Bubble>
        </FadeInContainer>
      ))}
    </Container>
  );
};

const Bubble = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  border-radius: 10px;
  color: rgba(172, 0, 216, 0.7);
  width: 100%;
  text-align: left;
  border: 2px solid rgba(172, 0, 216, 0.7);

  button {
    flex-shrink: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default FollowUpQuestions;
