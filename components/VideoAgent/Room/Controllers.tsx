import {
  useAudioTrack,
  useDaily,
  useLocalSessionId,
  useVideoTrack,
} from "@daily-co/daily-react";
import styled from "@emotion/styled";

import { useVideoAgentContext } from "../context";
import { Button } from "@/components/uiStyled/Button";
import { Mic, MicOff, LogOut, Video, VideoOff } from "lucide-react";

const Controllers = ({
  onLeave,
  handleToggleScreen,
}: {
  onLeave: () => void;
  handleToggleScreen?: () => void;
}) => {
  const {
    callContext: { fullScreen },
  } = useVideoAgentContext();

  const daily = useDaily();

  const localId = useLocalSessionId();
  const camTrack = useVideoTrack(localId);
  const micTrack = useAudioTrack(localId);

  const handleMute = () => {
    daily?.setLocalAudio(micTrack.isOff);
  };

  const handleCamera = () => {
    daily?.setLocalVideo(camTrack.isOff);
  };

  return (
    <Wrapper fullScreen={fullScreen}>
      <div className="inner">
        <Button isRound={true} variant="icon" size="icon" onClick={handleMute}>
          {micTrack.isOff ? <MicOff /> : <Mic />}
        </Button>
        <Button
          isRound={true}
          variant="icon"
          size="icon"
          onClick={handleCamera}
        >
          {camTrack.isOff ? <VideoOff /> : <Video />}
        </Button>
        <Button isRound={true} variant="icon" size="icon" onClick={onLeave}>
          <LogOut />
        </Button>
      </div>
    </Wrapper>
  );
};

const MobileWrapper = styled.div`
  width: 100%;
  max-width: 100vw;
  display: flex;
  position: absolute;
  top: 0.5rem;
  z-index: 20000;

  .button {
    padding: 0 0.5rem;
    width: 33.3333%;
  }
`;

const Wrapper = styled.div<{
  fullScreen: boolean;
}>`
  width: 100%;
  padding: 0.5rem;
  position: absolute;
  z-index: 10;
  ${({ fullScreen }) => (fullScreen ? "top: 1rem" : "0")};

  .inner {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
`;

export default Controllers;
