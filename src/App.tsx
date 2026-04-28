/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Music2, 
  BookOpen, 
  Settings2,
  ChevronRight,
  ChevronLeft,
  Volume2
} from "lucide-react";
import { ChordDiagram } from "./components/ChordDiagram";
import { MISTY_CHORDS, MISTY_SONG, CHORD_VARIATIONS } from "./constants";
import { ChordData } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"practice" | "library" | "tips">("practice");
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(72);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentMeasure, setCurrentMeasure] = useState(0);
  const [loopSection, setLoopSection] = useState<number | null>(null);
  const [tapFeedback, setTapFeedback] = useState<{ text: string, color: string } | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastBeatStartTime = useRef<number>(Date.now());
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-calculate section boundaries for faster lookups
  const sections = React.useMemo(() => {
    let currentStart = 0;
    return MISTY_SONG.map(s => {
      const start = currentStart;
      const length = s.measures.length;
      currentStart += length;
      return { ...s, start, end: start + length };
    });
  }, []);

  const allMeasures = React.useMemo(() => sections.flatMap(s => s.measures), [sections]);
  
  const handleTick = useCallback(() => {
    lastBeatStartTime.current = Date.now();
    setCurrentBeat(prev => {
      const nextBeat = prev + 1;
      if (nextBeat >= 4) {
        setCurrentMeasure(m => {
          const nextMeasure = m + 1;
          
          if (loopSection !== null) {
            const section = sections[loopSection];
            if (nextMeasure >= section.end) {
              return section.start;
            }
          }

          if (nextMeasure >= allMeasures.length) {
            setIsPlaying(false);
            return 0;
          }
          return nextMeasure;
        });
        return 0;
      }
      return nextBeat;
    });
  }, [allMeasures.length, loopSection, sections]);

  useEffect(() => {
    if (isPlaying) {
      const msPerBeat = (60 / tempo) * 1000;
      timerRef.current = setInterval(handleTick, msPerBeat);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, tempo, handleTick]);

  const currentMeasureData = allMeasures[currentMeasure];
  // Determine which chord is active based on currentBeat
  let accumBeats = 0;
  let activeChordName = currentMeasureData.chords[0].chord;
  for (const c of currentMeasureData.chords) {
    accumBeats += c.beats;
    if (currentBeat < accumBeats) {
      activeChordName = c.chord;
      break;
    }
  }

  const handleTap = () => {
    if (!isPlaying) return;
    
    const now = Date.now();
    const msPerBeat = (60 / tempo) * 1000;
    const timeSinceBeatStart = now - lastBeatStartTime.current;
    
    // We want the tap to be close to 0 or msPerBeat (beginning or end of the current visual beat)
    // Actually, it's easier to check distance to "now" vs "expected next beat"
    const offset = Math.min(timeSinceBeatStart, Math.abs(msPerBeat - timeSinceBeatStart));
    const accuracy = offset / msPerBeat;

    let feedback = { text: "MISS", color: "text-red-500" };
    if (accuracy < 0.1) feedback = { text: "PERFECT", color: "text-green-500 font-black" };
    else if (accuracy < 0.2) feedback = { text: "GREAT", color: "text-emerald-500 font-bold" };
    else if (accuracy < 0.35) feedback = { text: "GOOD", color: "text-amber-500" };
    else feedback = { text: "LATE/EARLY", color: "text-stone-400" };

    setTapFeedback(feedback);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => setTapFeedback(null), 600);
  };

  const activeChord = MISTY_CHORDS[activeChordName];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-200">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-amber-600 p-2 rounded-lg text-white">
            <Music2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Misty</h1>
            <p className="text-sm text-stone-500 font-mono">Guitar Coach v1.0</p>
          </div>
        </div>
        
        <nav className="flex gap-2">
          {[
            { id: "practice", icon: Play, label: "Practice" },
            { id: "library", icon: BookOpen, label: "Library" },
            { id: "tips", icon: Settings2, label: "Tips" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? "bg-stone-900 text-white" 
                  : "hover:bg-stone-100 text-stone-600"
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        {activeTab === "practice" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Chord Focus */}
            <div className="lg:col-span-1 border-r border-stone-200 lg:pr-8">
              <div className="sticky top-28">
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-2">Current Chord</h2>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeChordName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-center"
                    >
                      {activeChord ? (
                        <ChordDiagram chord={activeChord} size={240} />
                      ) : (
                        <div className="text-stone-400 italic">Chord not defined</div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                  <h3 className="font-bold flex items-center gap-2 mb-4">
                    <Volume2 size={18} className="text-amber-600" />
                    Metronome
                  </h3>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <button 
                      onClick={() => setTempo(t => Math.max(40, t - 4))}
                      className="p-2 rounded-full bg-stone-100 hover:bg-stone-200"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="text-center">
                      <div className="text-3xl font-black text-stone-900 leading-none">{tempo}</div>
                      <div className="text-[10px] uppercase tracking-tighter text-stone-400 font-bold">BPM</div>
                    </div>
                    <button 
                      onClick={() => setTempo(t => Math.min(200, t + 4))}
                      className="p-2 rounded-full bg-stone-100 hover:bg-stone-200"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  
                  <div className="flex gap-2 justify-center mb-6">
                    {[0, 1, 2, 3].map(i => (
                      <div 
                        key={i}
                        className={`h-2 w-full rounded-full transition-all duration-100 ${
                          i === currentBeat 
                            ? i === 0 ? "bg-amber-500 scale-y-125 shadow-lg shadow-amber-200" : "bg-stone-800 scale-y-110" 
                            : "bg-stone-200"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                        isPlaying 
                          ? "bg-stone-100 text-stone-900 border-2 border-stone-200" 
                          : "bg-amber-600 text-white shadow-xl shadow-amber-200 hover:bg-amber-700"
                      }`}
                    >
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                      {isPlaying ? "Pause" : "Play"}
                    </button>
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentBeat(0);
                        setCurrentMeasure(0);
                        setTapFeedback(null);
                      }}
                      className="p-3 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                    >
                      <RotateCcw size={20} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-stone-200 overflow-hidden relative">
                  <h3 className="font-bold mb-4 flex items-center justify-between">
                    <span>Rhythm Pad</span>
                    <AnimatePresence>
                      {tapFeedback && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 1.5 }}
                          className={`text-xs tracking-widest ${tapFeedback.color}`}
                        >
                          {tapFeedback.text}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </h3>
                  
                  <button
                    onMouseDown={handleTap}
                    className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all active:scale-95 touch-none ${
                      isPlaying 
                        ? "border-amber-300 bg-amber-50/50 hover:bg-amber-50 cursor-pointer" 
                        : "border-stone-200 bg-stone-50 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white shadow-inner flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full transition-all duration-75 ${isPlaying ? "bg-amber-500 shadow-lg" : "bg-stone-200"}`} />
                    </div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Tap rhythm here</span>
                  </button>

                  <div className="mt-4 h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                    <motion.div 
                      key={currentBeat}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 60/tempo, ease: "linear" }}
                      className="h-full bg-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Song Structure */}
            <div className="lg:col-span-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6 px-2">Song Flow</h2>
              
              <div className="space-y-12">
                {MISTY_SONG.map((section, sIdx) => {
                  const sectionStartMeasure = MISTY_SONG.slice(0, sIdx).reduce((acc, s) => acc + s.measures.length, 0);
                  const isSectionActive = currentMeasure >= sectionStartMeasure && currentMeasure < sectionStartMeasure + section.measures.length;

                  return (
                    <section key={section.title} className={isSectionActive ? "opacity-100" : "opacity-50 grayscale transition-all"}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black flex items-center gap-3">
                          <span className="bg-stone-900 text-white text-xs px-2 py-1 rounded select-none">
                            {section.title.charAt(0)}
                          </span>
                          {section.title}
                        </h3>
                        <button
                          onClick={() => {
                            if (loopSection === sIdx) {
                              setLoopSection(null);
                            } else {
                              setLoopSection(sIdx);
                              const sectionData = sections[sIdx];
                              setCurrentMeasure(sectionData.start);
                              setCurrentBeat(0);
                              setIsPlaying(true); // Auto-play when section is selected for looping
                            }
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            loopSection === sIdx 
                              ? "bg-amber-600 text-white shadow-md shadow-amber-200" 
                              : "bg-white text-stone-500 border border-stone-200 hover:border-amber-300 shadow-sm"
                          }`}
                        >
                          <RotateCcw size={12} className={loopSection === sIdx ? "animate-spin" : ""} />
                          {loopSection === sIdx ? "Looping Active" : "Practice This Section"}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {section.measures.map((measure, mIdx) => {
                          const globalIdx = sectionStartMeasure + mIdx;
                          const isActive = currentMeasure === globalIdx;

                          return (
                            <div
                              key={mIdx}
                              onClick={() => {
                                setIsPlaying(false);
                                setCurrentMeasure(globalIdx);
                                setCurrentBeat(0);
                              }}
                              className={`cursor-pointer group relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                                isActive 
                                  ? "bg-white border-amber-500 shadow-2xl shadow-amber-100 -translate-y-1 scale-[1.02]" 
                                  : "bg-stone-100/50 border-stone-100 hover:border-stone-300 hover:bg-white"
                              }`}
                            >
                              <div className="absolute top-3 right-4 text-[10px] font-mono font-bold text-stone-300">
                                BAR {globalIdx + 1}
                              </div>
                              <div className="flex items-center gap-3">
                                {measure.chords.map((c, cIdx) => (
                                  <React.Fragment key={cIdx}>
                                    <div className="flex flex-col">
                                      <span className={`text-lg font-bold ${isActive ? "text-amber-900" : "text-stone-700"}`}>
                                        {c.chord}
                                      </span>
                                      <div className="flex gap-1 mt-1">
                                        {Array.from({ length: c.beats }).map((_, b) => (
                                          <div key={b} className={`h-1 w-3 rounded-full ${isActive ? "bg-amber-300" : "bg-stone-200"}`} />
                                        ))}
                                      </div>
                                    </div>
                                    {cIdx < measure.chords.length - 1 && (
                                      <div className="h-6 w-px bg-stone-300 mx-1" />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "library" && (
          <div className="space-y-16">
            <header className="max-w-2xl">
              <h2 className="text-4xl font-black mb-4">Chord Library</h2>
              <p className="text-stone-600 text-lg leading-relaxed">
                Unlock the harmonic secrets of "Misty". This library is your reference for every chord in the song, plus <span className="text-amber-700 font-bold">Jazz Variations</span> that professionals use to add flavor and movement to their arrangements.
              </p>
            </header>

            <section>
              <h2 className="text-xl font-bold text-stone-400 uppercase tracking-widest mb-8 border-b border-stone-200 pb-2">Core Song Chords</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Object.values(MISTY_CHORDS).map((chord) => (
                  <ChordDiagram key={chord.name} chord={chord} size={150} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-400 uppercase tracking-widest mb-8 border-b border-stone-200 pb-2">Deepen Your Vocab: Variations</h2>
              <div className="grid grid-cols-1 gap-12">
                {CHORD_VARIATIONS.map((group) => (
                  <div key={group.root}>
                    <h3 className="text-lg font-bold text-amber-800 mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {group.root}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {group.chords.map((chord) => (
                        <ChordDiagram key={chord.name} chord={chord} size={150} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "tips" && (
          <div className="max-w-2xl mx-auto py-10 space-y-12">
            <section>
              <h2 className="text-3xl font-black mb-4">Mastering "Misty"</h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                Erroll Garner's "Misty" is one of the most beloved jazz ballads. On guitar, the challenge lies in the complex voicings—using 4 or 5 strings to capture the rich piano textures.
              </p>
              
              <div className="space-y-6">
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                  <h3 className="font-bold text-amber-900 mb-2">1. The "Jazz Grip"</h3>
                  <p className="text-sm text-amber-800">
                    Many of these chords (like Bb13 or Gm7) use the thumb or avoid the 5th string. Focus on clean muting of the unused strings.
                  </p>
                </div>
                
                <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                  <h3 className="font-bold text-sky-900 mb-2">2. Ballad Feel</h3>
                  <p className="text-sm text-sky-800">
                    Play at a slow, relaxed tempo (between 60-80 BPM). Let the chords ring out, especially the Major 7ths.
                  </p>
                </div>
                
                <div className="bg-stone-900 p-6 rounded-2xl text-stone-100">
                  <h3 className="font-bold mb-2">3. Extension Colors</h3>
                  <p className="text-sm text-stone-300">
                    Notice the "Altered" chords like <code className="text-amber-400">C7#9(b5)</code>. These provide the tension that makes jazz sound sophisticated. Don't rush these transitions!
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
