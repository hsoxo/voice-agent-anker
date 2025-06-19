import { useEffect, useRef, useState } from "react";

export function useFrequencyData(bins = 32) {
  const [data, setData] = useState<Uint8Array>(new Uint8Array(bins));
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let source: MediaStreamAudioSourceNode;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64; // 小一点的频率分辨率
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        setData(new Uint8Array(dataArray));
        requestAnimationFrame(tick);
      };

      tick();
    });

    return () => {
      audioContextRef.current?.close();
    };
  }, [bins]);

  return data;
}
