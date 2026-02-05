import { Inter, Lora } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  // Variable font handles weight range automatically
  // Usage weights: 500 (Medium) for most headlines, 600 (SemiBold) for H1 emphasis
});
