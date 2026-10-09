import { loadFont as inter } from '@remotion/google-fonts/Inter';
import { loadFont as mono } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as pixel } from '@remotion/google-fonts/Silkscreen';

// Toda pilha termina em sans-serif: se a fonte falhar, nunca cai numa serifada.
export const INTER = `${inter('normal', { weights: ['500', '600', '800'], subsets: ['latin', 'latin-ext'] }).fontFamily}, sans-serif`;
export const MONO = `${mono('normal', { weights: ['400', '500'], subsets: ['latin'] }).fontFamily}, monospace`;
export const PIXEL = `${pixel('normal', { weights: ['700'], subsets: ['latin'] }).fontFamily}, sans-serif`;
