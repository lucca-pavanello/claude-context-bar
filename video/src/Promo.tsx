import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { boca, FINAL, kf, mundo, pose, tremor } from './coreo';
import { ALERTA_EM, Faixa } from './Faixa';
import { Final } from './Final';
import { Janela } from './Janela';
import { Legendas } from './Legendas';
import { ESC, ESC_PERTO, Layout, layout, pontoFaixa } from './layout';
import { FUNDO } from './paleta';
import { Som } from './Som';

export type PromoProps = { trilha: boolean };

const io = Easing.bezier(0.65, 0, 0.35, 1);

// De perto, a câmera fica parada durante cada corrida (assim quem foge cruza a tela) e anda depois de cada golpe.
const focoU = (f: number) =>
  kf(f, [[159, 220], [200, 220], [214, 250, io], [258, 250], [272, 285, io], [318, 285], [332, 322, io]]);

// Câmera: k é o zoom; F é o ponto do palco que fica preso em A na tela.
const camera = (f: number, L: Layout) => {
  const P0 = { x: 540, y: L.janela.y + L.janela.h / 2 };
  const Pb = pontoFaixa(L, 264, 47);
  const Pc = pontoFaixa(L, 470, 30);
  const Ac = { x: 730, y: Pc.y + 40 }; // rótulo da direita termina por volta de x=880 e a janela desce do chip /clear
  const Pd = pontoFaixa(L, focoU(Math.max(f, 159)), 24);
  const Ad = L.ancora;
  const lk = kf(f, [[0, 0], [56, 0], [96, 0], [132, Math.log(1.22), io], [135, Math.log(1.22)], [159, Math.log(ESC_PERTO / ESC), io]]);
  return {
    k: Math.exp(lk),
    F: {
      x: kf(f, [[0, P0.x], [50, Pb.x], [96, Pb.x], [110, Pc.x, io], [135, Pc.x], [159, Pd.x, io]]),
      y: kf(f, [[0, P0.y], [50, Pb.y], [96, Pb.y], [110, Pc.y, io], [135, Pc.y], [159, Pd.y, io]]),
    },
    A: {
      x: kf(f, [[0, P0.x], [50, Pb.x], [96, Pb.x], [110, Ac.x, io], [135, Ac.x], [159, Ad.x, io]]),
      y: kf(f, [[0, P0.y], [50, Pb.y], [96, Pb.y], [110, Ac.y, io], [135, Ac.y], [159, Ad.y, io]]),
    },
  };
};

const Ambiente: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 40% at ${50 + 12 * Math.sin(f / 70)}% ${32 + 6 * Math.cos(f / 55)}%, rgba(214,138,95,.16), transparent 70%),
          radial-gradient(50% 35% at ${40 - 10 * Math.sin(f / 60)}% ${82 + 5 * Math.sin(f / 80)}%, rgba(217,164,65,.08), transparent 70%)`,
      }}
    />
    <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.07, mixBlendMode: 'overlay' }}>
      <filter id="grao">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(f / 2)} />
      </filter>
      <rect width="100%" height="100%" filter="url(#grao)" />
    </svg>
  </AbsoluteFill>
);

export const Promo: React.FC<PromoProps> = ({ trilha }) => {
  const f = useCurrentFrame();
  const { height, fps } = useVideoConfig();
  const L = layout(height);
  const w = mundo(f);
  const e = pose(w);
  const cam = camera(f, L);
  const t = tremor(f);
  const tx = Math.round(cam.A.x - cam.F.x * cam.k + t.dx);
  const ty = Math.round(cam.A.y - cam.F.y * cam.k + t.dy);

  // A faixa sobe por cima do prompt na cena da barra e treme quando vira "⚠ /clear".
  const sobe = 1 - spring({ frame: f - 46, fps, config: { damping: 13, stiffness: 170 } });
  const ka = f - ALERTA_EM;
  const treme = ka >= 0 && ka < 18 ? Math.round(8 * Math.exp(-ka / 3.5) * Math.sin(2.3 * ka)) : 0;

  // Onde o Claudezinho está na tela no corte para o cartão final.
  const eFinal = pose(mundo(FINAL));
  const camFinal = camera(FINAL, L);
  const pFinal = pontoFaixa(L, eFinal.c.x, 30);
  const de = { x: camFinal.A.x + (pFinal.x - camFinal.F.x) * camFinal.k, y: camFinal.A.y + (pFinal.y - camFinal.F.y) * camFinal.k, esc: ESC * camFinal.k };

  return (
    <AbsoluteFill style={{ background: FUNDO }}>
      <Ambiente f={f} />
      <AbsoluteFill style={{ opacity: kf(f, [[FINAL, 1], [FINAL + 6, 0]]) }}>
        <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${cam.k})` }}>
          <Janela f={f} L={L} />
          <div
            style={{
              position: 'absolute',
              left: L.faixa.x + treme,
              top: L.faixa.y + Math.round(40 * sobe),
              opacity: kf(f, [[46, 0], [52, 1]]),
              boxShadow: `0 0 0 2px rgba(214,138,95,${kf(f, [[46, 1], [54, 1], [66, 0]])})`,
              borderRadius: 14 * ESC,
            }}
          >
            <Faixa f={f} w={w} e={e} esc={ESC} semClaude={f >= FINAL} posicaoBoca={(g) => boca(pose(mundo(g)))} />
          </div>
        </div>
      </AbsoluteFill>
      <Legendas f={f} L={L} />
      <Final f={f} fps={fps} L={L} de={de} passo={Math.floor(f / 7)} />
      <Som f={f} trilha={trilha} />
    </AbsoluteFill>
  );
};
