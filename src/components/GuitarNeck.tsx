/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { ChordData } from "../types";

interface Props {
  chord: ChordData | null;
  activeStrings?: number[];
}

export const GuitarNeck: React.FC<Props> = ({ chord }) => {
  const strings = 6;
  const numFrets = 14; // Showing more frets for a simulation feel
  
  // Find base fret if needed
  const numericFrets = chord?.frets.filter((f): f is number => typeof f === "number" && f > 0) || [];
  const minFret = numericFrets.length > 0 ? Math.min(...numericFrets) : 0;
  // Focus window: if current chord is high up, shift the view
  const focusStart = Math.max(1, Math.min(minFret - 1, numFrets - 5));

  return (
    <div className="w-full overflow-x-auto py-8 px-4 bg-stone-900 rounded-2xl shadow-inner border-y-4 border-stone-800">
      <div className="relative min-w-[800px] h-48 flex items-center">
        {/* Fretboard Wood */}
        <div className="absolute inset-0 bg-[#2d1e18] rounded shadow-2xl opacity-90" />
        
        {/* Nut */}
        <div className="absolute left-0 h-full w-4 bg-stone-300 z-10 shadow-lg rounded-l" />

        {/* Strings */}
        <div className="absolute inset-0 flex flex-col justify-between py-6 px-4">
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s} 
              className={`h-[1px] bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}
              style={{ height: `${1 + (5-s)*0.2}px` }} // Thicker for low strings
            />
          ))}
        </div>

        {/* Frets */}
        {Array.from({ length: numFrets }).map((_, i) => (
          <div 
            key={i}
            className="absolute h-full w-[3px] bg-stone-400 shadow-[1px_0_2px_rgba(0,0,0,0.4)]"
            style={{ left: `${(i + 1) * (100 / numFrets)}%` }}
          >
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-stone-500">
              {i + 1}
            </span>
          </div>
        ))}

        {/* Fret Markers (Dots) */}
        {[3, 5, 7, 9, 12].map((fret) => (
          <div 
            key={fret}
            className="absolute w-3 h-3 bg-stone-200/20 rounded-full left-1/2 top-1/2 -translate-y-1/2"
            style={{ left: `${(fret - 0.5) * (100 / numFrets)}%` }}
          />
        ))}

        {/* Current Chord Placement */}
        {chord?.frets.map((fret, stringIndex) => {
          if (fret === "x" || fret === 0) return null;
          
          return (
            <motion.div
              key={`${chord.name}-${stringIndex}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute w-8 h-8 rounded-full border-2 border-white/50 bg-amber-600 shadow-xl flex items-center justify-center z-20"
              style={{
                left: `${(fret - 0.5) * (100 / numFrets)}%`,
                top: `${(5 - stringIndex) * 16.66 + 8}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {chord.fingers?.[stringIndex] && (
                <span className="text-white text-xs font-black">{chord.fingers[stringIndex]}</span>
              )}
            </motion.div>
          );
        })}

        {/* Muted/Open Markers */}
        <div className="absolute -left-8 h-full flex flex-col justify-between py-5 text-stone-500 font-mono text-sm">
          {chord?.frets.map((f, i) => (
            <div key={i} className="h-4 flex items-center justify-center w-6">
              {f === "x" ? "×" : f === 0 ? "○" : ""}
            </div>
          )).reverse()}
        </div>
      </div>
    </div>
  );
};
