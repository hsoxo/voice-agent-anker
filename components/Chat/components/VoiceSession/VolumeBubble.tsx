import React, { useEffect, useRef } from "react";
import { useMicVolume } from "../../hooks/useMicVolume";
import { useFrequencyData } from "../../hooks/useFrequencyData";

const WIDTH = 460;
const HEIGHT = 720;
const RADIUS = 28; // 圆角半径
const FG_COLOR = "#ffffff";
const SHADOW_COLOR = "rgba(16, 190, 66, 0.8)";

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export const VolumeCanvasBubble = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const volume = useMicVolume();
  const freqs = useFrequencyData(); // 在组件中引入

  // 把 [0,255] 左右的音量映射到你想要的阴影范围 (5~40)
  const shadowSize = Math.min(60, Math.max(10, volume / 2 + 10));

  /* 初始化画布尺寸（处理 HiDPI） */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    canvas.style.width = `${WIDTH}px`;
    canvas.style.height = `${HEIGHT}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
  }, []);

  /* 每当音量变化 → 重绘 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    /* 1. 白色圆角背景 */
    drawRoundedRect(ctx, 0, 0, WIDTH, HEIGHT, RADIUS);
    ctx.fillStyle = FG_COLOR;
    ctx.fill();

    /* 2. clip - 限制后续绘制只发生在气泡内部 */
    ctx.save();
    drawRoundedRect(ctx, 0, 0, WIDTH, HEIGHT, RADIUS);
    ctx.clip();

    /* 3. 根据音量得到阴影宽度 thickness 以及透明度 alpha */
    const thickness = Math.min(120, Math.max(20, volume / 3)); // 15-120 像素
    const alpha = Math.min(0.7, volume / 150 + 0.1); // 0-0.7

    /* 辅助函数：创建“从边到内”渐变 */
    const makeGrad = (x0: number, y0: number, x1: number, y1: number) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, `rgba(16,190,66,${alpha})`);
      g.addColorStop(1, `rgba(16,190,66,0)`);
      return g;
    };

    /* 3-A 上边 */
    ctx.fillStyle = makeGrad(0, 0, 0, thickness);
    ctx.fillRect(0, 0, WIDTH, thickness);

    /* 3-B 下边 */
    ctx.fillStyle = makeGrad(0, HEIGHT, 0, HEIGHT - thickness);
    ctx.fillRect(0, HEIGHT - thickness, WIDTH, thickness);

    /* 3-C 左边 */
    ctx.fillStyle = makeGrad(0, 0, thickness, 0);
    ctx.fillRect(0, 0, thickness, HEIGHT);

    /* 3-D 右边 */
    ctx.fillStyle = makeGrad(WIDTH, 0, WIDTH - thickness, 0);
    ctx.fillRect(WIDTH - thickness, 0, thickness, HEIGHT);

    /* 4. 角落额外柔化：4 个小 radialGradient（可选，不想要可删） */
    // const corner = (cx: number, cy: number) => {
    //   const rad = ctx.createRadialGradient(cx, cy, 0, cx, cy, thickness);
    //   rad.addColorStop(0, `rgba(16,190,66,${alpha})`);
    //   rad.addColorStop(1, `rgba(16,190,66,0)`);
    //   ctx.fillStyle = rad;
    //   ctx.beginPath();
    //   ctx.arc(cx, cy, thickness, 0, Math.PI * 2);
    //   ctx.fill();
    // };
    // corner(thickness, thickness); // 左上
    // corner(WIDTH - thickness, thickness); // 右上
    // corner(thickness, HEIGHT - thickness); // 左下
    // corner(WIDTH - thickness, HEIGHT - thickness); // 右下

    ctx.restore(); // 结束 clip

    /* 5. 可选文字 */
    // ctx.fillStyle = "#333";
    // ctx.font = "20px sans-serif";
    // ctx.fillText(`🎙️ 音量：${volume.toFixed(0)}`, 24, 32);

    // 6. 画波形条 or 静音圆点
    const isSilent = freqs.reduce((a, b) => a + b, 0) / freqs.length < 5;
    const centerY = HEIGHT / 2;
    const centerX = WIDTH / 2;
    const totalBars = freqs.length;
    const spacing = 9;
    const barWidth = 4;
    const graphWidth = (barWidth + spacing) * totalBars;
    const startX = centerX - graphWidth / 2;

    if (isSilent) {
      // 画圆点表示静音
      for (let i = 0; i < totalBars; i++) {
        const x = startX + i * (barWidth + spacing);
        ctx.beginPath();
        ctx.arc(x, centerY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#aaa";
        ctx.fill();
      }
    } else {
      // 动态柱状条
      for (let i = 0; i < totalBars; i++) {
        const value = freqs[i]; // 0~255
        const height = (value / 255) * 80 + 5; // 最小高度 5
        const x = startX + i * (barWidth + spacing);
        const y = centerY - height / 2;

        ctx.fillStyle = "rgba(16, 190, 66, 0.8)";

        const radius = Math.min(barWidth / 2, height / 2); // 防止超过条宽高

        ctx.beginPath();
        ctx.moveTo(x + radius, y); // 左上角
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);

        ctx.lineTo(x + barWidth, y + height - radius);
        ctx.quadraticCurveTo(
          x + barWidth,
          y + height,
          x + barWidth - radius,
          y + height
        );

        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);

        ctx.closePath();
        ctx.fill();
      }
    }
  }, [shadowSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{ borderRadius: RADIUS, display: "block" }}
    />
  );
};

export default VolumeCanvasBubble;
