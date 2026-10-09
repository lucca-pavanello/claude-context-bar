import React from 'react';
import { Easing } from 'remotion';
import { Alerta, Claudezinho, Rosto } from './arte';
import { Boneco, Estado, kf, migalhas, NHAC_1, NHAC_2, PTUI_1, PTUI_2, boca } from './coreo';
import { INTER, PIXEL } from './fontes';
import { AMBAR, CREME, MARROM, TERRACOTA } from './paleta';

// Mesma geometria da faixa do plugin (hooks/register.tsx), em unidades do SVG de 560x56.
const W = 560;
const H = 56;
const TRILHO_X = 128;
const TRILHO_W = 272;
const TRILHO_Y = 44;
const MARCA = TRILHO_X + (TRILHO_W * 45) / 100;
export const ALERTA_EM = 108; // quadro em que o rótulo vira "⚠ /clear"

const sai = Easing.out(Easing.cubic);
const pctEm = (f: number) => kf(f, [[54, 8], [72, 46.5, Easing.bezier(0.2, 0.8, 0.2, 1)], [80, 45, Easing.inOut(Easing.quad)]]);

const Sombra: React.FC<{ b: { x: number; vis: boolean }; larg: number }> = ({ b, larg }) =>
  b.vis ? <ellipse cx={b.x} cy={50} rx={larg} ry={2} fill="#000" opacity={0.35} /> : null;

const RostoNaFaixa: React.FC<{ b: Boneco; quem: 'bolso' | 'lula' }> = ({ b, quem }) =>
  b.vis ? (
    <g transform={`translate(${b.x - 15} ${4 + b.y}) translate(15 20) rotate(${b.giro}) scale(${b.sx} ${b.sy}) translate(-15 -20)`}>
      <Rosto quem={quem} passo={b.passo} />
    </g>
  ) : null;

// "nhac!" e "ptui!" (quadros reais, para seguirem vivos durante o congelamento da mordida).
const Onomato: React.FC<{ f: number; t: number; x: number; texto: string; giro: number }> = ({ f, t, x, texto, giro }) => {
  const k = f - t;
  if (k < 0 || k > 24) return null;
  const s = kf(k, [[0, 0], [3, 1.3, Easing.out(Easing.quad)], [7, 1, Easing.inOut(Easing.quad)]]);
  const y = -6 - 8 * sai(k / 24);
  const op = k > 18 ? 1 - (k - 18) / 6 : 1;
  const cx = x;
  return (
    <text
      x={0}
      y={0}
      transform={`translate(${cx} ${y}) rotate(${giro}) scale(${s})`}
      textAnchor="middle"
      fontFamily={PIXEL}
      fontWeight={700}
      fontSize={16}
      fill={AMBAR}
      stroke={MARROM}
      strokeWidth={3}
      paintOrder="stroke"
      opacity={op}
    >
      {texto}
    </text>
  );
};

type Props = { f: number; w: number; e: Estado; esc: number; semClaude?: boolean; posicaoBoca: (t: number) => { x: number; y: number } };

export const Faixa: React.FC<Props> = ({ f, w, e, esc, semClaude, posicaoBoca }) => {
  const pct = pctEm(f);
  const fillW = Math.max((TRILHO_W * pct) / 100, 1);
  const brilho = ((w * 3) % (fillW + 80)) - 40;
  const alertou = f >= ALERTA_EM;
  const hora = f < 97 ? '5h58' : f < 103 ? '5h59' : '6h00';
  const trocou = f < 97 ? 999 : f - (f < 103 ? 97 : 103);
  const rolagem = trocou < 5 ? kf(trocou, [[0, 7], [4, 0, sai]]) : 0;
  const pop = alertou ? kf(f - ALERTA_EM, [[0, 1], [3, 1.22, Easing.out(Easing.quad)], [10, 1, Easing.out(Easing.back(2))]]) : 1;
  const brilhoAlerta = alertou ? kf(f - ALERTA_EM, [[0, 0.55], [24, 0, Easing.out(Easing.quad)]]) : 0;
  const marcaH = kf(f, [[72, 9], [77, 16, sai], [84, 9, Easing.inOut(Easing.quad)]]);
  const anel = f >= 72 && f < 88 ? (f - 72) / 16 : -1;
  const b = boca(e);
  const someEsq = kf(f, [[96, 1], [106, 0]]);
  const someDir = kf(f, [[132, 1], [142, 0]]);
  const rot = 16 * esc;

  return (
    <div style={{ position: 'relative', width: W * esc, height: H * esc }}>
      <svg width={W * esc} height={H * esc} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', overflow: 'visible' }}>
        <defs>
          <clipPath id="enche">
            <rect x={TRILHO_X} y={TRILHO_Y} width={fillW} height={6} rx={3} />
          </clipPath>
        </defs>
        <rect width={W} height={H} rx={14} fill={MARROM} />
        <rect x={TRILHO_X} y={TRILHO_Y} width={TRILHO_W} height={6} rx={3} fill={CREME} fillOpacity={0.12} />
        <g clipPath="url(#enche)">
          <rect x={TRILHO_X} y={TRILHO_Y} width={fillW} height={6} fill={TERRACOTA} />
          <rect x={TRILHO_X + brilho} y={TRILHO_Y} width={40} height={6} fill="#fff" fillOpacity={0.25} />
        </g>
        <rect x={MARCA} y={TRILHO_Y + 3 - marcaH / 2} width={1.5} height={marcaH} fill={anel >= 0 ? AMBAR : CREME} fillOpacity={anel >= 0 ? 1 : 0.35} />
        {anel >= 0 ? <circle cx={MARCA + 0.75} cy={TRILHO_Y + 3} r={2 + 10 * sai(anel)} fill="none" stroke={AMBAR} strokeWidth={1.2} opacity={0.9 * (1 - anel)} /> : null}

        <Sombra b={e.bolso} larg={11 * e.bolso.sx} />
        <Sombra b={e.lula} larg={11 * e.lula.sx} />
        {semClaude ? null : <Sombra b={e.c} larg={15} />}
        <RostoNaFaixa b={e.bolso} quem="bolso" />
        <RostoNaFaixa b={e.lula} quem="lula" />
        {semClaude ? null : (
          <g transform={`translate(${e.c.x - 22} ${16 + e.c.y}) translate(22 28) scale(${e.c.sx} ${e.c.sy}) translate(-22 -28)`}>
            <Claudezinho tampa={e.c.tampa} boca={e.c.boca} passo={e.c.passo} />
          </g>
        )}
        {migalhas(f, posicaoBoca).map((m, i) => (
          <rect key={i} x={m.x} y={m.y} width={2} height={2} fill={m.cor} opacity={m.op} shapeRendering="crispEdges" />
        ))}
        <Onomato f={f} t={NHAC_1} x={b.x + 6} texto="nhac!" giro={-6} />
        <Onomato f={f} t={PTUI_1} x={b.x + 4} texto="ptui!" giro={5} />
        <Onomato f={f} t={NHAC_2} x={b.x + 6} texto="nhac!" giro={-6} />
        <Onomato f={f} t={PTUI_2} x={b.x + 4} texto="ptui!" giro={5} />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 18 * esc,
          top: 0,
          height: H * esc,
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 6 * esc,
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: rot,
          color: CREME,
          letterSpacing: 0.2 * esc,
          opacity: someEsq,
        }}
      >
        Contexto
      </div>
      <div
        style={{
          position: 'absolute',
          right: 18 * esc,
          top: 0,
          height: H * esc,
          display: 'flex',
          alignItems: 'center',
          gap: 5 * esc,
          paddingBottom: 6 * esc,
          fontFamily: INTER,
          fontSize: 14 * esc,
          fontVariantNumeric: 'tabular-nums',
          scale: String(pop),
          transformOrigin: 'right center',
          opacity: someDir,
        }}
      >
        {brilhoAlerta > 0 ? (
          <div style={{ position: 'absolute', inset: -10 * esc, borderRadius: 12 * esc, background: AMBAR, opacity: brilhoAlerta, filter: `blur(${8 * esc}px)` }} />
        ) : null}
        {alertou ? (
          <>
            <svg width={14 * esc} height={13 * esc} viewBox="0 0 14 13" style={{ position: 'relative' }}>
              <Alerta x={0} y={0} cor={AMBAR} />
            </svg>
            <span style={{ position: 'relative', color: AMBAR, fontWeight: 800 }}>/clear · 6h00</span>
          </>
        ) : (
          <span style={{ color: CREME, fontWeight: 600, translate: `0 ${rolagem * esc}px` }}>
            {Math.round(pct)}% · {hora}
          </span>
        )}
      </div>
    </div>
  );
};
