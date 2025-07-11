import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { Button } from "@/components/uiStyled/Button";
import FadeInContainer from "../FadeInContainer";
import { useChatStore } from "../../store";
import { useShallow } from "zustand/shallow";

export const LastestButtons = ({ show }: { show: boolean }) => {
  const { buttons } = useChatStore(
    useShallow((state) => ({
      buttons: state.buttons,
    }))
  );

  const lastestButtons = useMemo(() => {
    const maxPosition = Math.max(...buttons.map((btn) => btn.position));
    return buttons.filter((btn) => btn.position === maxPosition);
  }, [buttons]);

  if (!show || !lastestButtons.length) return null;
  return (
    <Container>
      {lastestButtons.map((btn, index) => (
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
