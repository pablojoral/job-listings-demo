/**
 * Icon shape data — Feather-style, 24x24 viewBox, stroke-based glyphs.
 *
 * Plain data, not components: `Icon.tsx` maps each shape to the matching
 * `react-native-svg` primitive at render time.
 */

export type IconName = 'search' | 'map-pin' | 'chevron-down' | 'close' | 'filter' | 'building';

export type IconShape =
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { type: 'rect'; x: number; y: number; width: number; height: number; rx?: number }
  | { type: 'polyline'; points: string }
  | { type: 'circle'; cx: number; cy: number; r: number }
  | { type: 'path'; d: string };

export const icons: Record<IconName, IconShape[]> = {
  search: [
    { type: 'circle', cx: 11, cy: 11, r: 8 },
    { type: 'line', x1: 21, y1: 21, x2: 16.65, y2: 16.65 },
  ],
  'map-pin': [
    { type: 'path', d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' },
    { type: 'circle', cx: 12, cy: 10, r: 3 },
  ],
  'chevron-down': [{ type: 'polyline', points: '6 9 12 15 18 9' }],
  close: [
    { type: 'line', x1: 18, y1: 6, x2: 6, y2: 18 },
    { type: 'line', x1: 6, y1: 6, x2: 18, y2: 18 },
  ],
  filter: [{ type: 'path', d: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z' }],
  building: [
    { type: 'rect', x: 4, y: 2, width: 16, height: 20, rx: 2 },
    { type: 'path', d: 'M9 22v-4h6v4' },
    { type: 'path', d: 'M8 6h.01' },
    { type: 'path', d: 'M12 6h.01' },
    { type: 'path', d: 'M16 6h.01' },
    { type: 'path', d: 'M8 10h.01' },
    { type: 'path', d: 'M12 10h.01' },
    { type: 'path', d: 'M16 10h.01' },
    { type: 'path', d: 'M8 14h.01' },
    { type: 'path', d: 'M12 14h.01' },
    { type: 'path', d: 'M16 14h.01' },
  ],
};
