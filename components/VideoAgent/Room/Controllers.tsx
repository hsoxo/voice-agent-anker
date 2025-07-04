import {
  useAudioTrack,
  useDaily,
  useLocalSessionId,
  useVideoTrack,
} from "@daily-co/daily-react";
import styled from "@emotion/styled";

import { useVideoAgentStore } from "../store";
import { Button } from "@/components/uiStyled/Button";
import { Mic, MicOff, LogOut, Video, VideoOff } from "lucide-react";
import { useShallow } from "zustand/shallow";

const Controllers = ({
  onLeave,
  handleToggleScreen,
}: {
  onLeave: () => void;
  handleToggleScreen?: () => void;
}) => {
  const fullScreen = useVideoAgentStore(
    useShallow((state) => state.callContext.fullScreen)
  );

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
        <Button isRound={true} variant="danger" size="icon" onClick={onLeave}>
          <LogOut />
        </Button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  fullScreen: boolean;
}>`
  width: 100%;
  padding: 0.5rem;
  position: absolute;
  z-index: 10;
  ${({ fullScreen }) => (fullScreen ? "top: 1rem" : "0")};
`;

export default Controllers;
