import { useEffect, useRef, useState } from "react";

export function useMicVolume() {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let source: MediaStreamAudioSourceNode;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      analyser = audioContext.createAnalyser();
      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolume(avg);
        requestAnimationFrame(tick);
      };

      tick();
    });

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return volume;
}
