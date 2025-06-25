import React, { useCallback, useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClient, useRTVIClientEvent } from "@pipecat-ai/client-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/tailwind";

const ExpiryTimer: React.FC = () => {
  const voiceClient = useRTVIClient();
  const [exp, setExp] = useState<number | undefined>(undefined);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });

  useRTVIClientEvent(
    RTVIEvent.Connected,
    useCallback(() => setExp(voiceClient?.transportExpiry), [voiceClient])
  );

  useRTVIClientEvent(
    RTVIEvent.Disconnected,
    useCallback(() => {
      setExp(undefined);
      setTime({ minutes: 0, seconds: 0 });
    }, [])
  );

  const noExpiry = !exp || exp === 0;

  useEffect(() => {
    if (noExpiry) return;

    const futureTimestamp = exp;

    const updateTime = () => {
      if (noExpiry) clearInterval(interval);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const differenceInSeconds = futureTimestamp! - currentTimestamp;
      const minutes = Math.floor(differenceInSeconds / 60);
      const seconds = differenceInSeconds % 60;
      setTime({ minutes, seconds });
    };

    const interval = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(interval);
  }, [noExpiry, exp]);

  if (noExpiry) return null;

  const isExpired = time.minutes <= 0 && time.seconds <= 0;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="ml-auto flex flex-row items-center gap-1.5 rounded-lg bg-primary-100 px-3 py-2 text-sm border-t border-primary-200">
          <Timer size={20} className="text-primary-400" />
          <span
            className={cn(
              "font-semibold tracking-wider w-20",
              isExpired && "text-primary-400"
            )}
          >
            {isExpired
              ? "--:--"
              : `${time.minutes}m ${time.seconds.toString().padStart(2, "0")}s`}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Remaining session time before expiry</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ExpiryTimer;
