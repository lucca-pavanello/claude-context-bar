import React from 'react';
import { Easing, interpolate } from 'remotion';
import { Layout } from './layout';
import { MONO, INTER } from './fontes';
import { CREME, JANELA, TERRACOTA } from './paleta';

// Um chat comprido do Claude Code: o histórico sobe rápido no gancho.
const LINHAS: [string, 'eu' | 'claude'][] = [
  ['deixa o checkout mais rápido', 'eu'],
  ['Lendo 37 arquivos', 'claude'],
  ['Editando src/pagamento.ts', 'claude'],
  ['Rodando os testes: 212 ok', 'claude'],
  ['agora arruma o carrinho', 'eu'],
  ['Lendo 52 arquivos', 'claude'],
  ['Editando src/carrinho.tsx', 'claude'],
  ['e o cupom de frete?', 'eu'],
  ['Lendo 64 arquivos', 'claude'],
  ['Editando src/frete.ts', 'claude'],
  ['volta no checkout', 'eu'],
  ['Hmm, que checkout?', 'claude'],
];

export const Janela: React.FC<{ f: number; L: Layout }> = ({ f, L }) => {
  const { x, y, w, h } = L.janela;
  const topoLinhas = y + 76;
  const fimLinhas = L.faixa.y - 18;
  const altura = LINHAS.length * 50;
  const rola = interpolate(f, [0, 44], [0, Math.max(0, altura - (fimLinhas - topoLinhas))], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const cursor = f % 16 < 8;
  const apaga = interpolate(f, [128, 140], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: apaga, borderRadius: 28, background: JANELA, boxShadow: '0 30px 80px rgba(0,0,0,.55), inset 0 0 0 2px rgba(230,223,209,.07)' }}>
      <div style={{ position: 'absolute', left: 26, top: 22, display: 'flex', gap: 12 }}>
        {['#e0675a', '#d9a441', '#7fae68'].map((c) => (
          <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c, opacity: 0.8 }} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 16, textAlign: 'center', fontFamily: INTER, fontWeight: 600, fontSize: 24, color: CREME, opacity: 0.45 }}>
        Claude Code
      </div>
      <div
        style={{
          position: 'absolute',
          left: 44,
          right: 44,
          top: topoLinhas - y,
          height: fimLinhas - topoLinhas,
          overflow: 'hidden',
          maskImage: 'linear-gradient(to bottom, transparent 0, #000 90px, #000 calc(100% - 36px), transparent 100%)',
        }}
      >
        <div style={{ translate: `0 ${-rola}px` }}>
          {LINHAS.map(([texto, quem], i) => (
            <div key={i} style={{ height: 50, display: 'flex', alignItems: 'center', gap: 16, fontFamily: MONO, fontSize: 27, color: CREME, opacity: quem === 'eu' ? 0.9 : 0.55 }}>
              {quem === 'eu' ? (
                <span style={{ color: TERRACOTA, fontWeight: 500 }}>{'>'}</span>
              ) : (
                <span style={{ width: 12, height: 12, borderRadius: 6, background: TERRACOTA, marginLeft: 2, marginRight: 2 }} />
              )}
              <span>{texto}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: L.faixa.y - y + 98 + 14,
          height: 86,
          borderRadius: 18,
          border: '2px solid rgba(230,223,209,.22)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 28,
          gap: 14,
          fontFamily: MONO,
          fontSize: 30,
          color: CREME,
        }}
      >
        <span style={{ color: TERRACOTA }}>{'>'}</span>
        <span style={{ width: 16, height: 34, background: CREME, opacity: cursor ? 0.85 : 0 }} />
      </div>
    </div>
  );
};
