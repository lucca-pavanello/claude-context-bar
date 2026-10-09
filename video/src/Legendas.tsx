import React from 'react';
import { Easing } from 'remotion';
import { FINAL, kf } from './coreo';
import { INTER } from './fontes';
import { Layout } from './layout';
import { AMBAR, CREME, FUNDO, TERRACOTA } from './paleta';

type Palavra = { t: string; cor?: string; chip?: boolean };
type Linha = { entra: number; sai: number; palavras: Palavra[]; linha?: number };

const p = (frase: string, destaques: Record<string, { cor: string; chip?: boolean }> = {}): Palavra[] =>
  frase.split(' ').map((t) => ({ t, ...destaques[t] }));

// Textos na tela (quadros reais). Sem travessão e sem fonte serifada.
const LINHAS: Linha[] = [
  { entra: -99, sai: 44, palavras: p('Chat longo | piora o Claude.', { piora: { cor: TERRACOTA } }) },
  { entra: 48, sai: 92, palavras: p('Compacte em 45%', { '45%': { cor: TERRACOTA } }) },
  { entra: 95, sai: 134, palavras: p('Avisa a hora do /clear', { '/clear': { cor: AMBAR, chip: true } }) },
  { entra: 139, sai: 204, palavras: p('E de bônus…') }, // daqui em diante a imagem fala sozinha
  { entra: FINAL + 9, sai: 999, palavras: p('Barra de contexto | pro Claude Code') },
];

const sai = Easing.out(Easing.cubic);
const vemCom = Easing.out(Easing.back(1.6));

const Frase: React.FC<{ f: number; l: Linha; L: Layout }> = ({ f, l, L }) => {
  if (f < l.entra || f > l.sai) return null;
  const k = f - l.sai;
  const saida = k > -6 ? (k + 6) / 6 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top: L.titulo.top + (l.linha ?? 0) * L.titulo.tamanho * 1.12,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: L.titulo.tamanho * 0.26,
        fontFamily: INTER,
        fontWeight: 800,
        fontSize: L.titulo.tamanho,
        lineHeight: 1.08,
        letterSpacing: -0.02 * L.titulo.tamanho,
        color: CREME,
        opacity: 1 - Easing.in(Easing.cubic)(saida),
        translate: `0 ${-16 * Easing.in(Easing.cubic)(saida)}px`,
      }}
    >
      {l.palavras.map((w, i) => {
        if (w.t === '|') return <div key={i} style={{ flexBasis: '100%', height: 0 }} />;
        const t0 = l.entra + i * 3;
        const a = l.entra < 0 ? 1 : kf(f, [[t0, 0], [t0 + 9, 1, sai]]);
        const y = l.entra < 0 ? kf(f, [[0, 10], [10, 0, sai]]) : kf(f, [[t0, 30], [t0 + 9, 0, vemCom]]);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: a,
              translate: `0 ${y}px`,
              color: w.chip ? FUNDO : w.cor ?? CREME,
              background: w.chip ? w.cor : undefined,
              borderRadius: w.chip ? 14 : undefined,
              padding: w.chip ? '0 14px 4px' : undefined,
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

export const Legendas: React.FC<{ f: number; L: Layout }> = ({ f, L }) => (
  <>
    {LINHAS.map((l, i) => (
      <Frase key={i} f={f} l={l} L={L} />
    ))}
  </>
);
