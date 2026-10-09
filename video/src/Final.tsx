import React from 'react';
import { Easing, spring } from 'remotion';
import { Claudezinho } from './arte';
import { FINAL, kf } from './coreo';
import { INTER } from './fontes';
import { Layout } from './layout';
import { CREME, FUNDO, TERRACOTA } from './paleta';

type Props = { f: number; fps: number; L: Layout; de: { x: number; y: number; esc: number }; passo: number };

// Cartão final: o Claudezinho sai da faixa no mesmo lugar e tamanho (match cut) e cresce no centro.
export const Final: React.FC<Props> = ({ f, fps, L, de, passo }) => {
  if (f < FINAL) return null;
  const k = f - FINAL;
  const ida = spring({ frame: k, fps, config: { damping: 14, stiffness: 140 } });
  const esc = de.esc + (7 - de.esc) * ida;
  const cx = de.x + (540 - de.x) * ida;
  const cy = de.y + (L.final.heroi - de.y) * ida;
  const tampa = kf(k, [[27, 0], [31, -22, Easing.out(Easing.cubic)], [38, 0, Easing.out(Easing.back(2))]]);
  const entra = (t: number) => ({
    opacity: kf(f, [[t, 0], [t + 8, 1, Easing.out(Easing.cubic)]]),
    translate: `0 ${kf(f, [[t, 26], [t + 9, 0, Easing.out(Easing.back(1.6))]])}px`,
  });
  const selo = spring({ frame: k - 17, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <>
      <svg
        width={44 * esc}
        height={28 * esc}
        viewBox="0 0 44 28"
        style={{ position: 'absolute', left: Math.round(cx - 22 * esc), top: Math.round(cy - 14 * esc), overflow: 'visible' }}
      >
        <Claudezinho tampa={tampa} boca={false} passo={passo} />
      </svg>
      <div style={{ position: 'absolute', left: 60, right: 60, top: L.final.titulo, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 84, letterSpacing: -1.5, color: CREME, ...entra(FINAL + 11) }}>
        claude-context-bar
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: L.final.selo, display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: FUNDO, background: TERRACOTA, borderRadius: 999, padding: '10px 30px 12px', scale: String(Math.max(selo, 0)) }}>
          grátis no GitHub
        </div>
      </div>
      <div style={{ position: 'absolute', left: 40, right: 40, top: L.final.url, textAlign: 'center', fontFamily: INTER, fontWeight: 600, fontSize: 40, color: CREME, ...entra(FINAL + 23), opacity: 0.9 * entra(FINAL + 23).opacity }}>
        lucca-pavanello/claude-context-bar
      </div>
    </>
  );
};
