import React from 'react';
import { Audio } from '@remotion/media';
import { interpolate, staticFile, useVideoConfig } from 'remotion';
import { FINAL, NHAC_1, NHAC_2, PTUI_1, PTUI_2 } from './coreo';
import { ALERTA_EM } from './Faixa';

// Trilha (ElevenLabs, 120 BPM) e efeitos (ElevenLabs SFX), gerados no Magnific.
// Cada efeito entra alguns quadros antes do golpe para o pico cair no quadro certo.
const GOLPES = [NHAC_1, PTUI_1, NHAC_2, PTUI_2];

export const Som: React.FC<{ f: number; trilha: boolean }> = ({ f, trilha }) => {
  const { fps } = useVideoConfig();
  // a trilha abaixa um pouco em cada golpe, para o efeito aparecer
  const abaixa = GOLPES.some((g) => f >= g - 3 && f < g + 12);
  const volTrilha =
    interpolate(f, [0, 3], [0, 0.5], { extrapolateRight: 'clamp' }) *
    interpolate(f, [438, 449], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) *
    (abaixa ? 0.6 : 1);
  return (
    <>
      {trilha ? <Audio name="Trilha" src={staticFile('som/trilha.mp3')} trimBefore={fps / 2} volume={volTrilha} /> : null}
      <Audio name="Barra enchendo" src={staticFile('som/tique.mp3')} from={54} durationInFrames={18} volume={interpolate(f, [54, 64, 72], [0.22, 0.22, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} premountFor={fps} />
      <Audio name="Marca dos 45%" src={staticFile('som/pop.wav')} from={72} volume={0.18} premountFor={fps} />
      <Audio name="Alerta /clear" src={staticFile('som/alerta.mp3')} from={ALERTA_EM} volume={0.32} premountFor={fps} />
      <Audio name="Zoom" src={staticFile('som/bote-2.mp3')} from={143} volume={0.22} premountFor={fps} />
      <Audio name="Bote 1" src={staticFile('som/bote-1.mp3')} from={197} volume={0.45} premountFor={fps} />
      <Audio name="Nhac 1" src={staticFile('som/nhac.mp3')} from={NHAC_1 - 2} volume={0.6} premountFor={fps} />
      <Audio name="Mastiga 1" src={staticFile('som/mastiga-2.mp3')} from={214} durationInFrames={28} volume={0.4} premountFor={fps} />
      <Audio name="Ptui 1" src={staticFile('som/ptui-2.mp3')} from={PTUI_1 - 6} volume={0.55} premountFor={fps} />
      <Audio name="Bote 2" src={staticFile('som/bote-2.mp3')} from={305} volume={0.45} premountFor={fps} />
      <Audio name="Nhac 2" src={staticFile('som/nhac.mp3')} from={NHAC_2 - 2} volume={0.6} toneFrequency={1.12} premountFor={fps} />
      <Audio name="Mastiga 2" src={staticFile('som/mastiga-1.mp3')} from={319} durationInFrames={22} volume={0.7} premountFor={fps} />
      <Audio name="Ptui 2" src={staticFile('som/ptui-1.mp3')} from={PTUI_2 - 9} durationInFrames={20} volume={0.55} premountFor={fps} />
      <Audio name="Pop final" src={staticFile('som/pop.wav')} from={FINAL + 11} volume={0.4} premountFor={fps} />
    </>
  );
};
