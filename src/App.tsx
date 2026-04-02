import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#0ff] font-terminal selection:bg-[#f0f] selection:text-black crt-flicker">
      <div className="noise-overlay" />
      <div className="scanlines" />

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col screen-tear">
        <header className="mb-12 border-b-4 border-[#f0f] pb-4 flex flex-col items-start">
          <h1 className="text-4xl md:text-6xl font-pixel font-black tracking-tighter mb-4 uppercase">
            <span className="glitch-text text-[#0ff]" data-text="SYS.OP.SNAKE">
              SYS.OP.SNAKE
            </span>
          </h1>
          <p className="text-[#f0f] font-tech text-sm md:text-base tracking-widest uppercase mt-2">
            &gt; INITIALIZING NEURAL LINK... [OK]<br />
            &gt; AUDIO SUBSYSTEM... [ONLINE]
          </p>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
          {/* Game Section */}
          <div className="w-full max-w-lg order-2 lg:order-1 border-2 border-[#0ff] bg-black p-1 shadow-[4px_4px_0_0_#f0f]">
            <div className="bg-[#f0f] text-black font-pixel text-xs p-2 mb-2">EXEC: SNAKE.EXE</div>
            <SnakeGame />
          </div>

          {/* Music Player Section */}
          <div className="w-full max-w-md order-1 lg:order-2 border-2 border-[#f0f] bg-black p-1 shadow-[4px_4px_0_0_#0ff]">
            <div className="bg-[#0ff] text-black font-pixel text-xs p-2 mb-2">EXEC: AUDIO_DECODER.EXE</div>
            <MusicPlayer />
          </div>
        </main>
        
        <footer className="mt-12 border-t-2 border-[#0ff] pt-4 font-tech text-xs md:text-sm text-[#0ff] flex justify-between">
          <span>&gt; STATUS: CORRUPTED</span>
          <span className="glitch-text" data-text="ERR_0x00F9">ERR_0x00F9</span>
        </footer>
      </div>
    </div>
  );
}
