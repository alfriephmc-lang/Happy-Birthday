export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Stops the page from refreshing
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("ERROR: " + error.message);
      setLoading(false);
    } else {
      // If you are using React Router later, change this. 
      // For now, it will look for calendar.html in your public folder.
      window.location.href = '/calendar.html'; 
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
      
      {/* BACKGROUND LAYER */}
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
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="EMAIL" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 text-white outline-none border border-white/10 focus:border-[#FF9FFC]/50" 
            required
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 text-white outline-none border border-white/10 focus:border-[#FF9FFC]/50" 
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF9FFC] text-black font-bold py-4 rounded-2xl uppercase tracking-widest shadow-lg shadow-[#FF9FFC]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "Login System"}
          </button>
        </form>
      </div>
    </div>
  );
}
