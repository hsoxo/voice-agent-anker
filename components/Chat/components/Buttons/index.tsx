import React from "react";
import styled from "@emotion/styled";
import { Button } from "@/components/uiStyled/Button";
import FadeInContainer from "../FadeInContainer";
import { useChatStore } from "../../store";
import { useShallow } from "zustand/shallow";

export const Buttons = ({
  show,
  position,
}: {
  show: boolean;
  position: number;
}) => {
  const { buttons } = useChatStore(
    useShallow((state) => ({
      buttons: state.buttons,
    }))
  );

  const currentButtons = buttons.filter((btn) => btn.position === position);
  if (!show || !currentButtons.length) return null;
  return (
    <Container>
      {currentButtons.map((btn, index) => (
        <FadeInContainer key={index}>
          <Button
            variant="success"
            size="sm"
            onClick={() => window.open(btn.href, "_blank")}
          >
            {btn.label}
          </Button>
        </FadeInContainer>
      ))}
    </Container>
  );
};

const Container = styled.div`
  padding: 4px 10px;
  display: flex;
  gap: 10px;
`;
