import React, { useRef, useEffect } from 'react';

const GridScan = ({
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
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let startTime = Date.now();

    const render = () => {
      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;
      const elapsed = (Date.now() - startTime) / 1000;
      
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Grid
      const step = 50 * gridScale * 10; // Adjusting scale for visibility
      ctx.beginPath();
      ctx.strokeStyle = linesColor;
      ctx.lineWidth = lineThickness;
      
      for (let x = 0; x <= width; x += step) {
        ctx.moveTo(x + (Math.random() * lineJitter), 0);
        ctx.lineTo(x + (Math.random() * lineJitter), height);
      }
      for (let y = 0; y <= height; y += step) {
        ctx.moveTo(0, y + (Math.random() * lineJitter));
        ctx.lineTo(width, y + (Math.random() * lineJitter));
      }
      ctx.stroke();

      // 2. Calculate Scan Position (Ping-Pong)
      const totalCycle = scanDuration + scanDelay;
      const progress = (elapsed % totalCycle) / scanDuration;
      let scanY = 0;

      if (progress <= 1) {
        // Ping-pong math
        const sinePos = (Math.sin(progress * Math.PI - Math.PI / 2) + 1) / 2;
        scanY = sinePos * height;

        // 3. Draw Scan Line
        const gradient = ctx.createLinearGradient(0, scanY - (50 * scanSoftness), 0, scanY + (50 * scanSoftness));
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, scanColor);
        gradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = scanOpacity;
        ctx.shadowBlur = 20 * scanGlow;
        ctx.shadowColor = scanColor;
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanY - (25 * scanSoftness), width, 50 * scanSoftness);
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }

      // 4. Add Noise (Film Grain)
      if (noiseIntensity > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * noiseIntensity})`;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [gridScale, scanDuration, scanDelay, scanColor, linesColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block"
      style={{ background: 'transparent' }}
    />
  );
};

export default GridScan;
