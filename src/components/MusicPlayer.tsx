import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Drive (AI Gen)",
    artist: "CyberBeats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "Cybernetic Pulse (AI Gen)",
    artist: "SynthMind",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "Digital Horizon (AI Gen)",
    artist: "NeuralNet",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full p-4 bg-black text-[#0ff] font-terminal">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-start gap-4 mb-6 border-b border-[#f0f] pb-4">
        <div className="w-16 h-16 bg-[#f0f] flex items-center justify-center text-black font-pixel text-2xl">
          {isPlaying ? '>>' : '||'}
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-pixel text-[#0ff] truncate mb-1">
            {currentTrack.title}
          </h3>
          <p className="text-lg text-[#f0f] truncate font-tech">
            &gt; {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-4 bg-[#050505] mb-6 cursor-pointer border border-[#0ff] relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-[#f0f] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex justify-between px-1 text-[10px] font-pixel text-white mix-blend-difference pointer-events-none items-center">
          <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor(audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-[#0ff]">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-[#f0f] font-pixel text-sm">
            {isMuted ? '[MUTED]' : '[VOL]'}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-[#f0f]"
          />
        </div>

        <div className="flex items-center gap-4 font-pixel text-sm">
          <button 
            onClick={playPrev}
            className="text-[#0ff] hover:text-[#f0f] hover:bg-[#0ff] hover:text-black px-2 py-1"
          >
            {'<'}
          </button>
          <button 
            onClick={togglePlay}
            className="bg-[#f0f] text-black px-4 py-1 hover:bg-[#0ff]"
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button 
            onClick={playNext}
            className="text-[#0ff] hover:text-[#f0f] hover:bg-[#0ff] hover:text-black px-2 py-1"
          >
            {'>'}
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        <h4 className="text-sm font-pixel text-[#f0f] mb-2">&gt; DIRECTORY LISTING</h4>
        {TRACKS.map((track, index) => (
          <button
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`w-full flex items-center justify-between p-2 font-tech text-lg text-left ${
              index === currentTrackIndex 
                ? 'bg-[#0ff] text-black' 
                : 'hover:bg-[#f0f] hover:text-black text-[#0ff]'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span>{index === currentTrackIndex ? '>' : '-'}</span>
              <span className="truncate">{track.title}</span>
            </div>
            <span>[{track.duration}]</span>
          </button>
        ))}
      </div>
    </div>
  );
}
