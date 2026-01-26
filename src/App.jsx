import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://twtfuxqzxocqsekbdlaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dGZ1eHF6eG9jcXNla2JkbGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTMzMTEsImV4cCI6MjA4NDY2OTMxMX0.JnJq5-0_bwWnm-7ounoDs9sa2yb4_Xb7k39TWH5Ae0A';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- GRIDSCAN COMPONENT (Internal) ---
const GridScan = ({
  lineThickness = 1,
  linesColor = "#392e4e",
  scanColor = "#FF9FFC",
  scanOpacity = 0.4,
  gridScale = 0.1,
  lineJitter = 0.1,
  scanGlow = 0.5,
  scanSoftness = 2,
  scanDuration = 2,
  noiseIntensity = 0.01,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const { width, height } = canvas;
      const time = Date.now() / 1000;

      ctx.clearRect(0, 0, width, height);

      // Draw Grid lines
      const spacing = 50 * gridScale * 10;
      ctx.beginPath();
      ctx.strokeStyle = linesColor;
      ctx.lineWidth = lineThickness;
      for (let x = 0; x < width; x += spacing) {
        ctx.moveTo(x + (Math.random() * lineJitter), 0);
        ctx.lineTo(x + (Math.random() * lineJitter), height);
      }
      for (let y = 0; y < height; y += spacing) {
        ctx.moveTo(0, y + (Math.random() * lineJitter));
        ctx.lineTo(width, y + (Math.random() * lineJitter));
      }
      ctx.stroke();

      // Draw Scanning Line (Ping-Pong movement)
      const scanPos = (Math.sin((time * Math.PI) / scanDuration) + 1) / 2;
      const yPos = scanPos * height;

      const grad = ctx.createLinearGradient(0, yPos - 50 * scanSoftness, 0, yPos + 50 * scanSoftness);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, scanColor);
      grad.addColorStop(1, 'transparent');

      ctx.globalAlpha = scanOpacity;
      ctx.fillStyle = grad;
      ctx.shadowBlur = 15 * scanGlow;
      ctx.shadowColor = scanColor;
      ctx.fillRect(0, yPos - 25 * scanSoftness, width, 50 * scanSoftness);

      // Add static noise
      ctx.globalAlpha = noiseIntensity;
      ctx.fillStyle = 'white';
      for (let i = 0; i < 500; i++) {
        ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [linesColor, scanColor, gridScale, scanDuration, lineThickness, lineJitter, noiseIntensity, scanGlow, scanOpacity, scanSoftness]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("ACCESS DENIED: " + error.message.toUpperCase());
      setLoading(false);
    } else {
      // Success! Redirecting to your calendar page
      window.location.href = '/calendar.html'; 
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
      
      {/* Background Layer: GridScan */}
      <div className="absolute inset-0 z-0">
        <GridScan 
          gridScale={0.1}
          scanColor="#FF9FFC" 
          linesColor="#392e4e"
          scanDuration={3}
          noiseIntensity={0.02}
        />
      </div>

      {/* Foreground Layer: Login Card */}
      <div className="relative z-10 w-full max-w-[360px] p-10 rounded-[40px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Event <span className="text-[#FF9FFC]">Calendar</span>
          </h1>
          <p className="text-white/40 text-[9px] font-bold tracking-[0.5em] uppercase mt-2">
            Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              required
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-bold tracking-widest outline-none focus:border-[#FF9FFC]/50 focus:bg-white/10 transition-all placeholder:text-white/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative space-y-1">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="PASSWORD" 
              required
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-bold tracking-widest outline-none focus:border-[#FF9FFC]/50 focus:bg-white/10 transition-all placeholder:text-white/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#FF9FFC] hover:text-white transition-colors"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FF9FFC] text-[#0a0a0f] font-black py-4 rounded-2xl text-[11px] tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,159,252,0.2)] disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login System"}
          </button>
        </form>

        <div className="mt-12 pt-6 border-t border-white/5 text-center">
          <p className="text-[9px] text-white/20 font-bold tracking-widest uppercase">
            System Node: <span className="text-white/50">ProjectVibe</span>
          </p>
        </div>
      </div>
    </div>
  );
}
