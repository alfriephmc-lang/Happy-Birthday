import React, { useState, useRef, useEffect } from "react";

export default function GridScan({
  sensitivity = 0.55,
  lineThickness = 1,
  linesColor = "#392e4e",
  scanColor = "#FF9FFC",
  scanOpacity = 0.4,
  gridScale = 0.1,
  lineStyle = "solid",
  lineJitter = 0.1,
  scanDirection = "pingpong",
  noiseIntensity = 0.01,
  scanGlow = 0.5,
  scanSoftness = 2,
  scanDuration = 2,
  scanDelay = 2,
  scanOnClick = false,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let startTime = Date.now();

    const resize = () => {
      // Safely resize based on parent container
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      const { width, height } = canvas;
      const elapsed = (Date.now() - startTime) / 1000;
      
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Grid
      const spacing = 50 * gridScale * 10;
      ctx.beginPath();
      ctx.strokeStyle = linesColor;
      ctx.lineWidth = lineThickness;
      
      if (lineStyle === "dashed") {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }

      for (let x = 0; x <= width; x += spacing) {
        const jitter = (Math.random() - 0.5) * lineJitter * 20;
        ctx.moveTo(x + jitter, 0);
        ctx.lineTo(x + jitter, height);
      }
      for (let y = 0; y <= height; y += spacing) {
        const jitter = (Math.random() - 0.5) * lineJitter * 20;
        ctx.moveTo(0, y + jitter);
        ctx.lineTo(width, y + jitter);
      }
      ctx.stroke();

      // 2. Scan Movement Logic
      const totalCycle = scanDuration + scanDelay;
      const progress = (elapsed % totalCycle) / scanDuration;
      
      if (progress <= 1) {
        let y;
        if (scanDirection === "pingpong") {
          // Ping-pong math using sine for smoothness
          y = (Math.sin(progress * Math.PI - Math.PI / 2) + 1) / 2 * height;
        } else {
          y = progress * height;
        }

        // 3. Draw Scan Glow
        const gradient = ctx.createLinearGradient(0, y - (50 * scanSoftness), 0, y + (50 * scanSoftness));
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, scanColor);
        gradient.addColorStop(1, "transparent");

        ctx.globalAlpha = scanOpacity;
        ctx.shadowBlur = 20 * scanGlow;
        ctx.shadowColor = scanColor;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y - (25 * scanSoftness), width, 50 * scanSoftness);
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // 4. Static Noise Overlay
      if (noiseIntensity > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * noiseIntensity})`;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    gridScale, linesColor, scanColor, scanDuration, scanDirection, 
    scanOpacity, lineThickness, lineJitter, scanGlow, scanSoftness, 
    noiseIntensity, scanDelay, lineStyle
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block border-none outline-none"
      style={{
        pointerEvents: scanOnClick ? "auto" : "none",
        background: "transparent"
      }}
    />
  );
}
