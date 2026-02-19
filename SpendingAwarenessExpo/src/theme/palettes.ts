/**
 * Light and dark palettes - premium feel (warm linen light, strong dark).
 * Same semantic keys so components can switch via theme.
 */
export type Palette = {
  terracotta: string;
  sage: string;
  cream: string;
  sand: string;
  umber: string;
  gray: string;
  dustyRose: string;
  golden: string;
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  card: string;
  muted: string;
  destructive: string;
  accent: string;
};

export const lightPalette: Palette = {
  terracotta: '#B86F52',
  sage: '#7A9E7E',
  cream: '#F8F4EE',
  sand: '#EDE8E0',
  umber: '#2C2C2C',
  gray: '#6B6560',
  dustyRose: '#C49595',
  golden: '#C9A03D',
  primary: '#B86F52',
  secondary: '#7A9E7E',
  background: '#F5F0E8',
  foreground: '#2C2C2C',
  card: '#EDE8E0',
  muted: '#6B6560',
  destructive: '#C49595',
  accent: '#C9A03D',
};

export const darkPalette: Palette = {
  terracotta: '#D4896E',
  sage: '#8FB393',
  cream: '#1C1C1C',
  sand: '#1E1E1E',
  umber: '#F0EDE8',
  gray: '#9A9590',
  dustyRose: '#D4A8A8',
  golden: '#D4B04A',
  primary: '#D4896E',
  secondary: '#8FB393',
  background: '#0D0D0D',
  foreground: '#F0EDE8',
  card: '#1C1C1C',
  muted: '#9A9590',
  destructive: '#D4A8A8',
  accent: '#D4B04A',
};
