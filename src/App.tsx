/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  ChevronRight,
  Clock,
  Zap,
  Leaf,
  Heart,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

// --- Types ---

interface Scene {
  id: number;
  duration: number; // in seconds
  image: string;
  text: string;
  subtext?: string;
  keywords: string;
  theme: 'dark' | 'light';
}

// --- Constants ---

const SCENES: Scene[] = [
  {
    id: 1,
    duration: 3,
    image: 'https://images.unsplash.com/photo-1544717297-fa95b3ee21f3?q=80&w=1080&auto=format&fit=crop',
    text: '怎麼努力還是瘦不下來？',
    subtext: 'STUCK IN A CYCLE',
    keywords: 'tired woman office professional stress rubbing eyes',
    theme: 'light'
  },
  {
    id: 2,
    duration: 4,
    image: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=1080&auto=format&fit=crop',
    text: '不是你不努力，是代謝變慢',
    subtext: 'METABOLISM SLOWDOWN',
    keywords: 'late night stress pressure sedentary lifestyle blue light',
    theme: 'dark'
  },
  {
    id: 3,
    duration: 5,
    image: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=1080&auto=format&fit=crop',
    text: '5大天然草本，啟動代謝',
    subtext: 'PREMIUM HERBAL ACTIVATION',
    keywords: 'turmeric ginseng cinnamon herbs healthy supplement premium',
    theme: 'light'
  },
  {
    id: 4,
    duration: 8,
    image: 'https://images.unsplash.com/photo-1571019623129-f48f4305ec2c?q=80&w=1080&auto=format&fit=crop',
    text: '調整體質・提升活力・輕盈生活',
    subtext: 'VITALITY & RADIANCE',
    keywords: 'active woman smiling drinking water morning light energized',
    theme: 'light'
  },
  {
    id: 5,
    duration: 6,
    image: 'https://images.unsplash.com/photo-1550963295-019d8a8a61c5?q=80&w=1080&auto=format&fit=crop',
    text: '每天一包，輕鬆養成健康體質',
    subtext: 'EFFORTLESS DAILY CARE',
    keywords: 'hand holding health packet supplement convenient routine',
    theme: 'light'
  },
  {
    id: 6,
    duration: 4,
    image: 'https://images.unsplash.com/photo-1611095773164-1628ca973b64?q=80&w=1080&auto=format&fit=crop',
    text: '現在開始，找回你的輕盈狀態',
    subtext: 'RECLAIM YOUR LIGHTNESS',
    keywords: 'premium health product golden light rays cinematic glow',
    theme: 'dark'
  }
];

// --- Components ---

export default function App() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiImages, setAiImages] = useState<Record<number, string>>({});
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentScene = SCENES[currentSceneIndex];
  const totalDuration = SCENES.reduce((acc, s) => acc + s.duration, 0);

  // Playback Logic
  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now() - (progress / 100) * totalDuration * 1000;
      
      const updateProgress = () => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const newProgress = (elapsed / totalDuration) * 100;
        
        if (newProgress >= 100) {
          setProgress(100);
          setIsPlaying(false);
          return;
        }
        
        setProgress(newProgress);
        
        // Find current scene based on elapsed time
        let cumulative = 0;
        let index = 0;
        for (let i = 0; i < SCENES.length; i++) {
          cumulative += SCENES[i].duration;
          if (elapsed < cumulative) {
            index = i;
            break;
          }
          if (i === SCENES.length - 1) index = i;
        }
        
        if (index !== currentSceneIndex) {
          setCurrentSceneIndex(index);
        }
        
        timerRef.current = requestAnimationFrame(updateProgress) as any;
      };
      
      timerRef.current = requestAnimationFrame(updateProgress) as any;
    } else {
      if (timerRef.current) cancelAnimationFrame(timerRef.current as any);
    }
    
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current as any);
    };
  }, [isPlaying, progress, currentSceneIndex]);

  const togglePlay = () => {
    if (progress >= 100) {
      setProgress(0);
      setCurrentSceneIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setProgress(0);
    setCurrentSceneIndex(0);
    setIsPlaying(true);
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const currentImageUrl = aiImages[currentScene.id] || currentScene.image;

  return (
    <div className="flex h-screen w-full flex-col bg-[#0C0C0C] text-white overflow-hidden selection:bg-orange-500/30">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tighter uppercase">Metabolism Quick</h1>
            <p className="text-[10px] font-mono text-white/40">AD GENERATOR v3.1</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-medium disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : 'text-orange-400'}`} />
            {isGenerating ? 'Synthesizing...' : 'AI Enhance'}
          </button>
          <div className="w-px h-4 bg-white/10" />
          <button className="text-white/60 hover:text-white"><Share2 className="w-4 h-4" /></button>
          <button className="text-white/60 hover:text-white"><Download className="w-4 h-4" /></button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-6 gap-6 items-center justify-center overflow-hidden">
        
        {/* Ad Preview (Vertical 9:16) */}
        <div className="relative h-full aspect-[9/16] bg-black shadow-2xl rounded-2xl overflow-hidden border border-white/10 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSceneIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img 
                src={currentImageUrl} 
                alt={currentScene.text}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
            </motion.div>
          </AnimatePresence>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-10 z-10 pointer-events-none">
            {/* Top Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              key={`badge-${currentSceneIndex}`}
              className="self-start"
            >
              <div className="px-3 py-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/80">
                  {currentScene.subtext}
                </span>
              </div>
            </motion.div>

            {/* Main Text */}
            <div className="flex flex-col gap-4">
              <motion.h2
                key={`text-${currentSceneIndex}`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={`text-3xl md:text-4xl font-bold leading-tight tracking-tight text-white`}
              >
                {currentScene.text}
              </motion.h2>

              {currentSceneIndex === 5 && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 self-start pointer-events-auto flex items-center gap-2 px-8 py-4 bg-orange-500 text-black rounded-full font-bold text-lg hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20"
                >
                  立即體驗 <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Player Progress Bar (Top) */}
          <div className="absolute top-2 left-2 right-2 flex gap-1 z-50">
            {SCENES.map((scene, idx) => {
              let sceneProgress = 0;
              const elapsed = (progress / 100) * totalDuration;
              let cumulative = 0;
              for (let i = 0; i < idx; i++) cumulative += SCENES[i].duration;
              
              if (elapsed > cumulative + scene.duration) {
                sceneProgress = 100;
              } else if (elapsed > cumulative) {
                sceneProgress = ((elapsed - cumulative) / scene.duration) * 100;
              }

              return (
                <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-100 ease-linear" 
                    style={{ width: `${sceneProgress}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Quick Controls overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
             <div className="flex items-center gap-6 pointer-events-auto">
                <button onClick={handleRestart} className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white">
                  <RotateCcw className="w-6 h-6" />
                </button>
                <button onClick={togglePlay} className="p-6 bg-white text-black rounded-full shadow-xl hover:scale-105 transition-all">
                  {isPlaying ? <Pause className="w-8 h-8" fill="currentColor" /> : <Play className="w-8 h-8 ml-1" fill="currentColor" />}
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white">
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex-1 max-w-md flex flex-col gap-6 self-start md:self-stretch">
          <div className="p-6 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Scene Timeline
            </h3>
            <div className="space-y-4">
              {SCENES.map((scene, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setCurrentSceneIndex(idx);
                    let cumulative = 0;
                    for (let i = 0; i < idx; i++) cumulative += SCENES[i].duration;
                    setProgress((cumulative / totalDuration) * 100);
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all border ${
                    idx === currentSceneIndex 
                      ? 'bg-orange-500/10 border-orange-500/50 text-white' 
                      : 'border-transparent text-white/50 hover:bg-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono ${
                    idx === currentSceneIndex ? 'bg-orange-500 text-black' : 'bg-white/10'
                  }`}>
                    0{idx + 1}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-medium line-clamp-1">{scene.text}</p>
                    <p className="text-[10px] opacity-60 uppercase">{scene.duration} Seconds</p>
                  </div>
                  {idx === currentSceneIndex && isPlaying && (
                    <div className="flex gap-0.5 items-end h-3">
                      <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-orange-500" />
                      <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-orange-500" />
                      <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-orange-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <Leaf className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Natural Focus</span>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed italic">
                薑黃、人參、肉桂等5大草本配方
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Heart className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Health First</span>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed italic">
                啟動代謝循環，養成健康體質
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="px-6 py-6 border-t border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5 text-black" fill="currentColor" /> : <Play className="w-5 h-5 ml-1 text-black" fill="currentColor" />}
            </button>
            <button 
              onClick={handleRestart}
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-2">
             <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase tracking-tighter">
                <span>00:{Math.floor((progress / 100) * totalDuration).toString().padStart(2, '0')}</span>
                <span>TOTAL RUNTIME: {totalDuration}s</span>
                <span>00:{totalDuration}</span>
             </div>
             <div 
               className="h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer relative group"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = e.clientX - rect.left;
                 const newProgress = (x / rect.width) * 100;
                 setProgress(newProgress);
               }}
             >
               <div 
                 className="h-full bg-orange-500 rounded-full relative" 
                 style={{ width: `${progress}%` }}
               >
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-xl" />
               </div>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Resolution</span>
              <span className="text-xs font-mono">1080 × 1920 (9:16)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Codec</span>
              <span className="text-xs font-mono">H.264 / PRORES</span>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all font-bold text-sm text-white">
              EXPORT VIDEO <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
