import React, { useEffect, useRef, useState } from "react";
import { useLocalSessionId, useVideoTrack } from "@daily-co/daily-react";

const LocalCameraFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permission, setPermission] = useState<
    "granted" | "denied" | "prompt" | "error"
  >("prompt");
  const localId = useLocalSessionId();
  const camTrack = useVideoTrack(localId);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
      try {
        const result = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });

        setPermission(result.state as typeof permission);

        if (result.state === "granted") {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }

        result.onchange = async () => {
          setPermission(result.state as typeof permission);
          if (result.state === "granted" && !stream) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          }
        };
      } catch (err) {
        // fallback: try directly
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setPermission("granted");
        } catch (e) {
          setPermission("denied");
          console.error("无法获取摄像头权限", e);
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        width: "100px",
        borderRadius: "8px",
        backgroundColor: "#000",
        visibility:
          permission !== "granted" || camTrack.isOff ? "hidden" : "visible",
      }}
    />
  );
};

export default LocalCameraFeed;
