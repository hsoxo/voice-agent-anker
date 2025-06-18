// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";

import { ThreeElements, useThree } from "@react-three/fiber";
import { ClampToEdgeWrapping, LinearFilter, VideoTexture } from "three";

const GreenScreenRemoval = ({
  videoId,
  width,
  height,
  aspectRatio: defaultAspectRatio,
  shadowRoot,
}: {
  videoId: string;
  width: number;
  height: number;
  aspectRatio: number;
  shadowRoot?: ShadowRoot;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<VideoTexture | null>(null);
  const meshRef = useRef<ThreeElements["mesh"]>(null);
  const { gl } = useThree();
  const [aspectRatio, setAspectRatio] = useState<number>(defaultAspectRatio);

  useEffect(() => {
    let video: HTMLVideoElement | null = null;
    if (shadowRoot) {
      video = shadowRoot.getElementById(videoId) as HTMLVideoElement;
    } else {
      video = document.getElementById(videoId) as HTMLVideoElement;
    }
    if (!video) return;

    const handleMetadata = () => {
      setAspectRatio(video.videoWidth / video.videoHeight);
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    if (video.videoWidth && video.videoHeight) {
      handleMetadata();
    }

    videoRef.current = video;
    const texture = new VideoTexture(video);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    textureRef.current = texture;

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
    };
  }, [gl, videoId]);

  if (!aspectRatio) return null;
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        uniforms={{
          u_texture: { value: textureRef.current },
          u_keyColor: { value: [0, 1, 0] }, // Green screen color
          u_videoAspect: { value: aspectRatio }, // Pass dynamic aspect ratio
          u_similarity: { value: 0.35 }, // Similarity threshold
          u_smoothness: { value: 0.19 }, // Smoothness factor
          u_spill: { value: 0.22 }, // Spill suppression factor
          u_featherWidth: { value: 0.1 }, // Feather width (5px in normalized coordinates)
        }}
        vertexShader={
          Math.abs(aspectRatio - 9 / 16) > 0.01
            ? `
            varying vec2 v_texCoord;
            uniform float u_videoAspect;
  
            void main() {
              float targetAspect = 9.0 / 16.0; // Target 9:16 aspect ratio for cropping
              vec2 scale = vec2(1.0);
  
              scale.x = targetAspect / u_videoAspect;
              vec2 uv = uv * scale + (1.0 - scale) * 0.5;
              v_texCoord = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `
            : `
            varying vec2 v_texCoord;
  
            void main() {
              v_texCoord = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `
        }
        fragmentShader={`
          precision mediump float;

          uniform sampler2D u_texture; // 视频纹理
          uniform vec3 u_keyColor;     // 关键色（绿幕颜色）
          uniform float u_similarity;  // 颜色相似度
          uniform float u_smoothness;  // 平滑度
          uniform float u_spill;       // 溢出抑制
          uniform float u_featherWidth; // 羽化宽度
          varying vec2 v_texCoord;     // 纹理坐标

          // RGB 转 UV 色彩空间
          vec2 RGBtoUV(vec3 rgb) {
            return vec2(
              rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.5    + 0.5,
              rgb.r *  0.5   + rgb.g * -0.419 + rgb.b * -0.081  + 0.5
            );
          }

          // 处理绿幕
          vec4 ProcessChromaKey(vec2 texCoord) {
            vec4 rgba = texture2D(u_texture, texCoord);

            // 计算与关键颜色的色差
            float chromaDist = distance(RGBtoUV(rgba.rgb), RGBtoUV(u_keyColor));

            // 平滑计算透明度
            float baseMask = chromaDist - u_similarity;
            float fullMask = pow(clamp(baseMask / u_smoothness, 0.0, 1.0), 1.5);
            rgba.a = fullMask;

            // 绿色溢出抑制（减少绿色边缘污染）
            float spillVal = pow(clamp(baseMask / u_spill, 0.0, 1.0), 1.5);
            float desat = clamp(rgba.r * 0.2126 + rgba.g * 0.7152 + rgba.b * 0.0722, 0.0, 1.0);
            rgba.rgb = mix(vec3(desat, desat, desat), rgba.rgb, spillVal);

            return rgba;
          }

          float FeatherEdge(vec2 texCoord, float featherWidth) {
            // 计算当前像素到边缘的距离
            vec2 dist = min(texCoord, 1.0 - texCoord);
            float minDist = min(dist.x, dist.y);

            // 根据距离计算羽化效果
            return smoothstep(0.0, featherWidth, minDist);
          }

          void main(void) {
            vec4 color = ProcessChromaKey(v_texCoord);
            float feather = FeatherEdge(v_texCoord, u_featherWidth);

            // 应用羽化效果
            color.a *= feather;

            gl_FragColor = color;
          }
          `}
        transparent
      />
    </mesh>
  );
};

export default GreenScreenRemoval;
