import { useCallback, useRef } from "react";
import { RTVIEvent } from "realtime-ai";
import { useRTVIClientEvent } from "realtime-ai-react";

export const AudioIndicatorBar: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useRTVIClientEvent(
    RTVIEvent.LocalAudioLevel,
    useCallback((volume: number) => {
      if (volRef.current)
        volRef.current.style.width = Math.max(2, volume * 100) + "%";
    }, [])
  );

  return (
    <div className="h-2 w-full rounded-full overflow-hidden bg-gray-200">
      <div
        ref={volRef}
        className="h-2 w-0 rounded-full bg-green-500 transition-[width] duration-100 ease-linear"
      />
    </div>
  );
};

export default AudioIndicatorBar;
