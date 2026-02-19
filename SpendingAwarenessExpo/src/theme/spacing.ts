/**
 * Spacing and radius - match web app (p-6, p-8, rounded-2xl, etc.)
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  screenPadding: 24,   // p-6
  screenPaddingLg: 32,  // p-8
} as const;

export const radius = {
  lg: 16,    // rounded-2xl (1rem)
  xl: 24,    // rounded-3xl (1.5rem)
  full: 9999,
} as const;

export const fonts = {
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  heading: 'Nunito_700Bold',
  headingSemi: 'Nunito_600SemiBold',
  headingMedium: 'Nunito_500Medium',
} as const;
