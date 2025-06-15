import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

import VideoAgent from "./VideoAgent";
import { useVideoAgentStore } from "./context";

function Box(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

const VideoAgentIndex = ({
  apiKey,
  agentId,
  baseUrl,
  width = 270,
}: {
  apiKey: string;
  agentId: string;
  baseUrl: string;
  width?: number;
}) => {
  const { setApiKey, setAgentId, setBaseUrl } = useVideoAgentStore();
  const [tavusLoaded, setTavusLoaded] = useState(false);

  useEffect(() => {
    setApiKey(apiKey);
    setAgentId(agentId);
    setBaseUrl(baseUrl);
  }, [setApiKey, setAgentId, setBaseUrl, apiKey, agentId, baseUrl]);

  return (
    <>
      <VideoAgent
        tavusLoaded={tavusLoaded}
        setTavusLoaded={setTavusLoaded}
        width={width}
      />
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </>
  );
};

export default VideoAgentIndex;
