import React from "react";

import { useParticipantIds } from "@daily-co/daily-react";
import styled from "@emotion/styled";
import Tile from "./Tile";

const Agent = ({ width, height, shadowRoot }: { width: number; height?: number; shadowRoot?: ShadowRoot }) => {
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });

  return (
    <Wrapper>
      {remoteParticipantIds.length > 0 ? (
        <>
          {remoteParticipantIds.map((id) => (
            <Tile key={id} id={id} width={width} height={height} shadowRoot={shadowRoot} />
          ))}
        </>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Agent;
