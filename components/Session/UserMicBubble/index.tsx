import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import React, { useCallback, useRef } from "react";
import { Mic, MicOff, Pause } from "lucide-react";
import { RTVIEvent } from "realtime-ai";
import { useRTVIClientEvent } from "realtime-ai-react";

const pulse = keyframes`
  0% { outline-width: 6px; }
  50% { outline-width: 24px; }
  100% { outline-width: 6px; }
`;

const pulseText = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const BubbleContainer = styled.div`
  color: #ffffff;
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  margin: auto;
  padding-top: 20px;

  @media (min-width: 768px) {
    padding-top: 0px;
  }
`;

const Bubble = styled.div<{ canTalk?: boolean; muted?: boolean; inactive?: boolean }>`
  position: relative;
  cursor: pointer;
  width: 100px;
  height: 100px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  z-index: 20;
  transition: all 0.5s ease, opacity 2s ease;
  opacity: 0.5;
  box-sizing: border-box;
  border: 6px solid rgba(99, 102, 241, 0.3); /* fallback */
  outline: 6px solid rgba(99, 102, 241, 0.3);
  background-color: #6366f1;
  background-image: radial-gradient(#a5b4fc, #818cf8);

  @media (min-width: 768px) {
    width: 120px;
    height: 120px;
    border-radius: 120px;
  }

  ${(props) =>
    props.canTalk &&
    `
    opacity: 1;
    background-color: #6366f1;
    background-image: radial-gradient(#6366f1, #4f46e5);
    border: 6px solid rgba(199, 210, 254, 0.4);
    outline: 6px solid rgba(129, 140, 248, 0.3);
    outline-offset: 4px;
  `}

  ${(props) =>
    props.inactive &&
    `
    pointer-events: none;
    cursor: not-allowed;
  `}

  ${(props) =>
    props.muted &&
    `
    background-color: #ef4444;
    background-image: radial-gradient(#ef4444, #dc2626);
    border: 6px solid rgba(254, 202, 202, 0.4);
    outline: 6px solid rgba(248, 113, 113, 0.3);
    animation: ${pulseText} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    &::after {
      content: "Unmute";
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 700;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #fee2e2;
    }
  `}
`;

const Icon = styled.div<{ canTalk?: boolean }>`
  position: relative;
  z-index: 20;
  line-height: 1;
  transition: opacity 0.5s ease;
  opacity: ${(props) => (props.canTalk ? 1 : 0.3)};
`;

const Volume = styled.div`
  position: absolute;
  overflow: hidden;
  inset: 0px;
  z-index: 0;
  border-radius: 999px;
  transition: all 0.1s ease;
  transform: scale(0);
  opacity: 0.5;
  background-color: #86efac;
`;

const SvgIcon = styled.div`
  width: 2rem;   /* 相当于 Tailwind 的 size-8 */
  height: 2rem;

  @media (min-width: 768px) {
    width: 2.5rem; /* md:size-10 */
    height: 2.5rem;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;


export const AudioIndicatorBubble: React.FC<{ scale?: number }> = ({ scale = 1.75 }) => {
  const volRef = useRef<HTMLDivElement>(null);

  useRTVIClientEvent(
    RTVIEvent.LocalAudioLevel,
    useCallback((volume: number) => {
      if (volRef.current) {
        const v = Number(volume) * scale;
        volRef.current.style.transform = `scale(${Math.max(0.1, v)})`;
      }
    }, [])
  );

  return <Volume ref={volRef} />;
};

interface Props {
  active: boolean;
  muted: boolean;
  handleMute: () => void;
}

export default function UserMicBubble({ active, muted, handleMute }: Props) {
  const canTalk = !muted && active;

  return (
    <BubbleContainer>
      <Bubble
        canTalk={canTalk}
        muted={muted && active}
        inactive={!active}
        onClick={() => handleMute()}
      >
        <Icon canTalk={canTalk}>
          <SvgIcon>
            {!active ? (
              <Pause />
            ) : canTalk ? (
              <Mic />
            ) : (
              <MicOff />
            )}
          </SvgIcon>
        </Icon>
        {canTalk && <AudioIndicatorBubble />}
      </Bubble>
    </BubbleContainer>
  );
}
