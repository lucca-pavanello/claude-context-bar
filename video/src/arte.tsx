import React from 'react';
import { MARROM, TERRACOTA } from './paleta';
import { ROSTO, ROSTO_LULA } from './rostos';

// Mesma geometria de hooks/register.tsx: Claudezinho 11x7 em unidades de 4px, virado pra direita.
const U = 4;
const Px: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <rect x={x * U} y={y * U} width={w * U} height={h * U} shapeRendering="crispEdges" />
);
const Dentes: React.FC<{ y: number; paraCima: boolean }> = ({ y, paraCima }) => (
  <>
    {[6, 14, 22, 30].map((x) => (
      <path key={x} d={`M${x} ${y}l3 ${paraCima ? -4 : 4}l3 ${paraCima ? 4 : -4}z`} />
    ))}
  </>
);

export type Pose = {
  tampa: number; // graus; -38 é a bocona toda aberta
  boca: boolean;
  passo: number; // alterna o balanço do corpo e das pernas
};

export const Claudezinho: React.FC<Pose> = ({ tampa, boca, passo }) => {
  const sobe = passo % 2 === 1;
  return (
    <g fill={TERRACOTA}>
      <g transform={`translate(0 ${sobe ? -2 : 0})`}>
        {boca ? (
          <g>
            <rect x={4} y={4} width={36} height={8} fill="#3a1410" />
            <g fill="#f4efe6">
              <Dentes y={12} paraCima />
            </g>
          </g>
        ) : null}
        <Px x={1} y={3} w={9} h={2} />
        <Px x={0} y={2} w={1} h={2} />
        <Px x={10} y={2} w={1} h={2} />
        <g transform={`translate(4 12) rotate(${tampa}) translate(-4 -12)`}>
          <Px x={1} y={0} w={9} h={3} />
          <g fill={MARROM}>
            <Px x={3} y={1} w={1} h={2} />
            <Px x={7} y={1} w={1} h={2} />
          </g>
          {boca ? (
            <g fill="#f4efe6">
              <Dentes y={12} paraCima={false} />
            </g>
          ) : null}
        </g>
      </g>
      <g transform={`translate(0 ${sobe ? -2 : 0})`}>
        <Px x={2} y={5} w={1} h={2} />
        <Px x={6} y={5} w={1} h={2} />
      </g>
      <g transform={`translate(0 ${sobe ? 0 : -2})`}>
        <Px x={4} y={5} w={1} h={2} />
        <Px x={8} y={5} w={1} h={2} />
      </g>
    </g>
  );
};

// Rostos 30x40, um path por cor.
export const Rosto: React.FC<{ quem: 'bolso' | 'lula'; passo: number }> = ({ quem, passo }) => (
  <g shapeRendering="crispEdges" transform={`translate(0 ${passo % 2 === 1 ? -2 : 0})`}>
    {Object.entries(quem === 'bolso' ? ROSTO : ROSTO_LULA).map(([cor, d]) => (
      <path key={cor} fill={cor} d={d} />
    ))}
  </g>
);

// ⚠ em pixel: a fonte pode não ter o glifo e o Chrome trocaria por emoji colorido.
export const Alerta: React.FC<{ x: number; y: number; cor: string }> = ({ x, y, cor }) => (
  <g transform={`translate(${x} ${y})`} shapeRendering="crispEdges">
    <path fill={cor} d="M6 0h2v2h1v2h1v2h1v2h1v2h1v3h-12v-3h1v-2h1v-2h1v-2h1v-2h1z" />
    <path fill={MARROM} d="M6 4h2v4h-2zM6 9h2v2h-2z" />
  </g>
);
