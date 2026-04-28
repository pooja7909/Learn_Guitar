/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChordData {
  name: string;
  frets: (number | "x")[]; // 0 is open, 'x' is muted
  fingers?: (number | null)[];
  barre?: number;
}

export interface SongSection {
  title: string;
  measures: Measure[];
}

export interface Measure {
  chords: {
    chord: string;
    beats: number;
  }[];
}
