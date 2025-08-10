import { Inter as SansFont, IBM_Plex_Sans_Arabic } from 'next/font/google';

/**
 * @sans
 * @description Define here the sans font for Latin scripts.
 * By default, it uses the Inter font from Google Fonts.
 */
const sans = SansFont({
  subsets: ['latin'],
  variable: '--font-sans',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
});

/**
 * @arabic
 * @description Define here the Arabic font.
 * Uses IBM Plex Sans Arabic from Google Fonts for Arabic text.
 */
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

/**
 * @heading
 * @description Define here the heading font.
 */
const heading = sans;

/**
 * @headingArabic
 * @description Define here the Arabic heading font.
 */
const headingArabic = arabic;

// we export these fonts into the root layout
export { sans, heading, arabic, headingArabic };
