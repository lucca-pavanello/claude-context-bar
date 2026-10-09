// Posições em pixels da tela. A faixa fica em escala 1,75 (uma unidade de 4px da arte vira 7px)
// e, de perto, em 5,0: escalas inteiras por unidade deixam o pixel art nítido.
export const ESC = 1.75;
export const ESC_PERTO = 5;

export type Layout = {
  titulo: { top: number; tamanho: number };
  janela: { x: number; y: number; w: number; h: number };
  faixa: { x: number; y: number };
  ancora: { x: number; y: number }; // onde a perseguição fica de perto
  final: { heroi: number; titulo: number; selo: number; url: number };
};

const VERTICAL: Layout = {
  titulo: { top: 300, tamanho: 92 },
  janela: { x: 40, y: 600, w: 1000, h: 650 },
  faixa: { x: 50, y: 1012 },
  ancora: { x: 540, y: 860 },
  final: { heroi: 640, titulo: 860, selo: 984, url: 1080 },
};

const FEED: Layout = {
  titulo: { top: 96, tamanho: 80 },
  janela: { x: 40, y: 330, w: 1000, h: 900 },
  faixa: { x: 50, y: 992 },
  ancora: { x: 540, y: 720 },
  final: { heroi: 480, titulo: 700, selo: 824, url: 920 },
};

export const layout = (altura: number) => (altura > 1500 ? VERTICAL : FEED);

// Ponto da faixa (unidades do SVG) em pixels da tela, sem câmera.
export const pontoFaixa = (L: Layout, u: number, v: number) => ({ x: L.faixa.x + u * ESC, y: L.faixa.y + v * ESC });
