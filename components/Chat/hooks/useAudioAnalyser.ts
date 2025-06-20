import { useEffect, useRef } from "react";

export interface AnalyserResult {
  volume: number; // 0‒255 平均值
  freqs: Uint8Array; // 频谱数据
}

export function useAudioAnalyser(
  track: MediaStreamTrack | null,
  options?: {
    bins?: number;
    muted?: boolean;
  }
): React.MutableRefObject<AnalyserResult> {
  const { bins = 32, muted = false } = options || {};
  const dataRef = useRef<AnalyserResult>({
    volume: 0,
    freqs: new Uint8Array(bins),
  });

  useEffect(() => {
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let raf: number;

    const init = async () => {
      const stream = track
        ? new MediaStream([track])
        : await navigator.mediaDevices.getUserMedia({ audio: true });

      const ctx = new AudioContext();
      analyser = ctx.createAnalyser();
      analyser.fftSize = bins * 2;
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      const src = ctx.createMediaStreamSource(stream);
      src.connect(analyser);

      const loop = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        dataRef.current = {
          volume: muted ? 0 : avg,
          freqs: new Uint8Array(dataArray.slice(0, bins)),
        };

        raf = requestAnimationFrame(loop);
      };
      loop();
    };

    init();
    return () => cancelAnimationFrame(raf);
  }, [track, bins, muted]);

  return dataRef;
}
