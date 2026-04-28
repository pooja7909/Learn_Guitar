/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ChordData } from "../types";

interface Props {
  chord: ChordData;
  size?: number;
}

export const ChordDiagram: React.FC<Props> = ({ chord, size = 150 }) => {
  const strings = 6;
  const fretsToShow = 5;
  const padding = 20;
  const width = size;
  const height = size * 1.2;
  const stringSpacing = (width - padding * 2) / (strings - 1);
  const fretSpacing = (height - padding * 3) / fretsToShow;

  // Find the base fret (usually 1, but could be higher for jazz chords)
  const numericFrets = chord.frets.filter((f): f is number => typeof f === "number" && f > 0);
  const minFret = numericFrets.length > 0 ? Math.min(...numericFrets) : 0;
  const baseFret = minFret > 4 ? minFret : 1;

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-lg border border-amber-100">
      <span className="text-xl font-bold font-sans text-amber-900">{chord.name}</span>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Nut / Top Fret */}
        <line
          x1={padding}
          y1={padding + 10}
          x2={width - padding}
          y2={padding + 10}
          stroke={baseFret === 1 ? "#451a03" : "#92400e"}
          strokeWidth={baseFret === 1 ? 4 : 2}
        />

        {/* Frets */}
        {Array.from({ length: fretsToShow }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={padding}
            y1={padding + 10 + (i + 1) * fretSpacing}
            x2={width - padding}
            y2={padding + 10 + (i + 1) * fretSpacing}
            stroke="#d1d5db"
            strokeWidth={1}
          />
        ))}

        {/* Strings */}
        {Array.from({ length: strings }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={padding + i * stringSpacing}
            y1={padding + 10}
            x2={padding + i * stringSpacing}
            y2={padding + 10 + fretsToShow * fretSpacing}
            stroke="#4b5563"
            strokeWidth={1.5}
          />
        ))}

        {/* Fret Markers */}
        {baseFret > 1 && (
          <text
            x={padding - 15}
            y={padding + 25}
            fontSize="12"
            fill="#92400e"
            className="font-mono font-bold"
          >
            {baseFret}
          </text>
        )}

        {/* Dots */}
        {chord.frets.map((fret, stringIndex) => {
          if (fret === "x") {
            return (
              <text
                key={`x-${stringIndex}`}
                x={padding + (5 - stringIndex) * stringSpacing - 4}
                y={padding + 5}
                fontSize="12"
                fill="#9ca3af"
                className="font-mono"
              >
                ×
              </text>
            );
          }
          if (fret === 0) {
            return (
              <circle
                key={`open-${stringIndex}`}
                cx={padding + (5 - stringIndex) * stringSpacing}
                cy={padding + 0}
                r={4}
                fill="none"
                stroke="#4b5563"
                strokeWidth={1}
              />
            );
          }
          
          const relativeFret = fret - baseFret + 1;
          if (relativeFret < 1 || relativeFret > fretsToShow) return null;

          return (
            <g key={`dot-${stringIndex}`}>
              <circle
                cx={padding + (5 - stringIndex) * stringSpacing}
                cy={padding + 10 + (relativeFret - 0.5) * fretSpacing}
                r={stringSpacing / 2.5}
                fill="#92400e"
              />
              {chord.fingers?.[stringIndex] && (
                <text
                  x={padding + (5 - stringIndex) * stringSpacing}
                  y={padding + 10 + (relativeFret - 0.5) * fretSpacing + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="white"
                  className="font-sans font-medium"
                >
                  {chord.fingers[stringIndex]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
