import React, { useEffect, useRef } from "react";
import { useAudioAnalyser } from "../../hooks/useAudioAnalyser";
import { useRTVIClientMediaTrack } from "@pipecat-ai/client-react";

const WIDTH = 460;
const HEIGHT = 720;
const RADIUS = 28; // 圆角半径
const FG_COLOR = "#ffffff";
const THEMES = {
  user: (alpha: number) => `rgba(16,190,66,${alpha})`,
  bot: (alpha: number) => `rgba(255,140,0,${alpha})`,
};

const ringCount = 4; // 圈数
const baseR = 100; // 基础半径
const pointCount = 100; // 每环采样点

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

export const VolumeCanvasBubble = ({ muted }: { muted: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const botTrack = useRTVIClientMediaTrack("audio", "bot");
  const botRef = useAudioAnalyser(botTrack);
  const userRef = useAudioAnalyser(null, { muted });
  const prevRRef = useRef<number[]>(
    Array(pointCount).fill(baseR) // 初始值
  );

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

    const draw = () => {
      const bot = botRef.current;
      const user = userRef.current;
      const ctx = canvas.getContext("2d")!;

      const margin = 3; // dB 左右的小阈值，避免频繁抖动
      const active =
        bot.volume > user.volume + margin
          ? "bot"
          : user.volume > bot.volume + margin
          ? "user"
          : undefined; // 都很小 => 静音

      const theme = active ? THEMES[active] : THEMES.user; // 静音时保持上一次 or 默认绿色
      const freqs = active === "bot" ? bot.freqs : user.freqs;
      const volume = active === "bot" ? bot.volume : user.volume;

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
      const thickness = Math.min(120, Math.max(20, volume / 8)); // 15-120 像素
      const alpha = Math.min(0.7, volume / 300 + 0.1); // 0-0.7

      /* 辅助函数：创建“从边到内”渐变 */
      const makeGrad = (x0: number, y0: number, x1: number, y1: number) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, theme(alpha));
        g.addColorStop(1, theme(0));
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

      // 4. 画波形条 or 静音圆点
      // const centerY = HEIGHT / 2 + 70;
      // const centerX = WIDTH / 2;
      // const totalBars = freqs.length;
      // const spacing = 9;
      // const barWidth = 4;
      // const half = Math.floor(totalBars / 2);

      // const avg = freqs.reduce((a, b) => a + b, 0) / totalBars;
      // const isSilent = avg < 5;

      // if (isSilent) {
      //   // 圆点模式
      //   ctx.fillStyle = "#aaa";
      //   for (let i = 0; i < half; i++) {
      //     const xL = centerX - (i + 1) * (barWidth + spacing) + barWidth / 2;
      //     const xR = centerX + i * (barWidth + spacing) + barWidth / 2;
      //     ctx.beginPath();
      //     ctx.arc(xL, centerY, 2, 0, Math.PI * 2);
      //     ctx.fill();
      //     ctx.beginPath();
      //     ctx.arc(xR, centerY, 2, 0, Math.PI * 2);
      //     ctx.fill();
      //   }
      // } else {
      //   // 动态波形柱
      //   for (let i = 0; i < half; i++) {
      //     const value = freqs[i];
      //     const height = (value / 255) * 80 + 5;
      //     const y = centerY - height / 2;

      //     const xL = centerX - (i + 1) * (barWidth + spacing);
      //     const xR = centerX + i * (barWidth + spacing);

      //     ctx.fillStyle = theme(0.8);
      //     drawRoundedBar(ctx, xL, y, barWidth, height);
      //     drawRoundedBar(ctx, xR, y, barWidth, height);
      //   }
      // }

      // ========= 🔄 Step 4 替换：恒定主题色 + 旋转叠环 =========
      const cx = WIDTH / 2;
      const cy = HEIGHT / 2 + 10;

      const t = performance.now() / 1000;
      const silent = volume < 5;
      const jitterAmp = silent ? 10 : 2 + volume / 10; // 抖动幅度
      const rotSpeed = silent ? 0.3 : volume / 200; // 旋转速度
      const prevR = prevRRef.current;
      const smooth = 0.15; // 越小越平滑

      ctx.lineWidth = 3;
      const volNorm = Math.min(volume, 120) / 120; // 0~1 归一化；120 以上透明度不再继续增

      const alphaIn =
        (silent
          ? 0.02 + volNorm * 0.04 // 静音范围：0.03 → 0.08
          : 0.05 + volNorm * 0.12) * 4; // 说话范围：0.05 → 0.17

      const alphaOut =
        (silent
          ? 0.015 + volNorm * 0.04 // 静音范围：0.015 → 0.055
          : 0.03 + volNorm * 0.07) * 4; // 说话范围：0.03  → 0.10

      for (let k = 0; k < ringCount; k++) {
        const radius = baseR + k * 8;
        const phase = k * 0.7; // 相位差
        const rot = t * rotSpeed + phase; // 时间旋转
        const alpha = alphaIn + (alphaOut - alphaIn) * (k / (ringCount - 1));
        const color = theme(alpha); // 恒定主题色

        ctx.beginPath();
        for (let p = 0; p <= pointCount; p++) {
          const a = (p / pointCount) * Math.PI * 2;
          const idx = p % freqs.length;
          const j = (freqs[idx] / 255) * jitterAmp; // 原 offset
          const target = radius + j;
          prevR[p] = prevR[p] + (target - prevR[p]) * smooth; // 低通滤波
          const r = prevR[p];
          const x = cx + Math.cos(a + rot) * r;
          const y = cy + Math.sin(a + rot) * r;
          p === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();

        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 25;
        ctx.stroke();
      }

      /* 5. 可选文字 */
      ctx.fillStyle = theme(0.8);
      ctx.shadowColor = theme(0.4);
      ctx.shadowBlur = 15;
      ctx.font =
        "20px ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (active === "bot") {
        ctx.fillText(`speaking...`, cx, cy);
      } else {
        ctx.fillText(`listening...`, cx, cy);
      }

      // ========= 🔄 替换结束 =====================================
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ borderRadius: RADIUS, display: "block" }}
    />
  );
};

export default VolumeCanvasBubble;
