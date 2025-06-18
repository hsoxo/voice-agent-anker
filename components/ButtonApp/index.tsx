import React, { useEffect, useState } from "react";
console.log("React version:", React.version, window.React.version);
console.log("Remote React instance:", React);
// @ts-ignore
console.log("Same instance as host:", React === window.React); // 这里应为 true，如果不是说明共享失败

import { Button } from "../uiStyled/Button";
import { AudioLines } from "lucide-react";
import AppWrapper from "./AppWrapper";

export default function ButtonApp({
  chatId = "",
  llmUrl = "",
  requestTemplate = null,
  setVoiceBotState,
  connectedComponent,
  autoStart = false,
}: {
  chatId?: string;
  llmUrl?: string;
  requestTemplate?: any;
  setVoiceBotState?: (state: string) => void;
  connectedComponent?: React.FC<{ onClick: () => void }>;
  autoStart?: boolean;
}) {
  console.log("llmUrl", llmUrl);
  console.log("requestTemplate", requestTemplate);
  const [activate, setActivate] = useState(autoStart);
  const handleSetVoiceBotState = (state: string) => {
    setVoiceBotState?.(state);
    console.log("state", state);
    if (state === "ready") {
      setTimeout(() => {
        document.getElementById("voice-start-button")?.click();
      }, 100);
    }
  };

  return (
    <>
      {activate ? (
        <AppWrapper
          chatId={chatId}
          llmUrl={llmUrl}
          requestTemplate={requestTemplate}
          onLeave={() => {
            setActivate(false);
            setVoiceBotState?.("idle");
          }}
          setVoiceBotState={handleSetVoiceBotState}
          connectedComponent={connectedComponent}
        />
      ) : (
        <Button
          key="start"
          isRound={true}
          variant="icon"
          size="icon"
          onClick={() => {
            setActivate(true);
          }}
        >
          <AudioLines />
        </Button>
      )}
    </>
  );
}
