import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import GridScan from './components/GridScan'; // Shadcn usually puts it here after you run the command

const supabase = createClient(
  'https://twtfuxqzxocqsekbdlaw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dGZ1eHF6eG9jcXNla2JkbGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTMzMTEsImV4cCI6MjA4NDY2OTMxMX0.JnJq5-0_bwWnm-7ounoDs9sa2yb4_Xb7k39TWH5Ae0A'
);

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="relative w-full h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
      
      {/* THIS IS THE COMPONENT YOU ADDED */}
      <div className="absolute inset-0 z-0">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
      <div className="relative z-10 bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 w-[360px]">
        <h1 className="text-white text-3xl font-black italic uppercase text-center mb-8">Event Calendar</h1>
        <form className="space-y-4">
          <input type="email" placeholder="EMAIL" className="w-full p-4 rounded-2xl bg-white/10 text-white outline-none border border-white/10" />
          <input type="password" placeholder="PASSWORD" className="w-full p-4 rounded-2xl bg-white/10 text-white outline-none border border-white/10" />
          <button className="w-full bg-[#FF9FFC] text-black font-bold py-4 rounded-2xl uppercase tracking-widest shadow-lg shadow-[#FF9FFC]/20">
            Login System
          </button>
        </form>
      </div>
    </div>
  );
}
