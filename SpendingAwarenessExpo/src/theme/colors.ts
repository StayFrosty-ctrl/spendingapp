/**
 * Grove color palette - from SpendingAwareness/styles/theme.css
 * Port exactly for pixel-consistent UI.
 */
export const colors = {
  // Grove palette
  terracotta: '#C4785A',   // primary, buttons, FAB, switch on
  sage: '#87A878',        // success, streak, secondary CTAs
  cream: '#FAF6F1',       // background, card insets, modal bg
  sand: '#EDE6DC',       // cards, inputs, secondary surfaces
  umber: '#3D3229',      // primary text, headings
  gray: '#7A7067',       // secondary text, labels, borders
  dustyRose: '#D4A5A5',  // destructive, log-purchase icon
  golden: '#D4A855',     // glow/blur accents
  // Aliases for semantic use
  primary: '#C4785A',
  secondary: '#87A878',
  background: '#FAF6F1',
  foreground: '#3D3229',
  card: '#EDE6DC',
  muted: '#7A7067',
  destructive: '#D4A5A5',
  accent: '#D4A855',
} as const;

export type Colors = typeof colors;
