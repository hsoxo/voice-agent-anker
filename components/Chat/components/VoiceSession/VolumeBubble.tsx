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

function drawRoundedBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const r = Math.min(w / 2, h / 2);
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
  ctx.fill();
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

    ctx.restore(); // 结束 clip

    // 6. 画波形条 or 静音圆点
    const centerY = HEIGHT / 2;
    const centerX = WIDTH / 2;
    const totalBars = freqs.length;
    const spacing = 9;
    const barWidth = 4;
    const half = Math.floor(totalBars / 2);

    const avg = freqs.reduce((a, b) => a + b, 0) / totalBars;
    const isSilent = avg < 5;

    if (isSilent) {
      // 圆点模式
      ctx.fillStyle = "#aaa";
      for (let i = 0; i < half; i++) {
        const xL = centerX - (i + 1) * (barWidth + spacing) + barWidth / 2;
        const xR = centerX + i * (barWidth + spacing) + barWidth / 2;
        ctx.beginPath();
        ctx.arc(xL, centerY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(xR, centerY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // 动态波形柱
      for (let i = 0; i < half; i++) {
        const value = freqs[i];
        const height = (value / 255) * 80 + 5;
        const y = centerY - height / 2;

        const xL = centerX - (i + 1) * (barWidth + spacing);
        const xR = centerX + i * (barWidth + spacing);

        ctx.fillStyle = "rgba(16, 190, 66, 0.8)";
        drawRoundedBar(ctx, xL, y, barWidth, height);
        drawRoundedBar(ctx, xR, y, barWidth, height);
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
