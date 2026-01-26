import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
// Assuming GridScan is a component you've imported or created
import GridScan from './components/GridScan'; 

const supabase = createClient(
  'https://twtfuxqzxocqsekbdlaw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dGZ1eHF6eG9jcXNla2JkbGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTMzMTEsImV4cCI6MjA4NDY2OTMxMX0.JnJq5-0_bwWnm-7ounoDs9sa2yb4_Xb7k39TWH5Ae0A'
);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert("ACCESS DENIED: " + error.message.toUpperCase());
      setLoading(false);
    } else {
      window.location.href = '/calendar';
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#392e4e"
            scanColor="#FF9FFC"
            scanOpacity={0.4}
            gridScale={0.1}
            lineStyle="solid"
            lineJitter={0.1}
            scanDirection="pingpong"
            noiseIntensity={0.01}
            scanGlow={0.5}
            scanSoftness={2}
            scanDuration={2}
            scanDelay={2}
            scanOnClick={false}
          />
        </div>
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-[380px] p-10 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Event Calendar
          </h1>
          <p className="text-[#FF9FFC] text-[10px] font-bold tracking-[0.4em] uppercase mt-2">
            System Authorization
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="EMAIL"
            className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-bold tracking-widest outline-none focus:border-[#FF9FFC]/50 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-bold tracking-widest outline-none focus:border-[#FF9FFC]/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#FF9FFC]"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF9FFC] text-[#0a0a0f] font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(255,159,252,0.3)]"
          >
            {loading ? "VERIFYING..." : "LOGIN SYSTEM"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-white/30 text-[9px] font-bold tracking-widest uppercase">
            Created by: <span className="text-white/60">ProjectVibe</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
