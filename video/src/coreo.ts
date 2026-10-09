import { Easing, random } from 'remotion';

// 30 fps, 15 s. A trilha é de 120 BPM: uma batida a cada 15 quadros, e os golpes caem nela.
export const FPS = 30;
export const DURACAO = 450;

// Quadros reais (os que o som e as legendas usam).
export const NHAC_1 = 210;
export const PTUI_1 = 255;
export const NHAC_2 = 315;
export const PTUI_2 = 345;
export const FINAL = 360;

// Na mordida o mundo congela 3 quadros (hit-stop); a câmera, o tremor e o "nhac!" seguem.
const PAUSAS = [NHAC_1, NHAC_2];
const PAUSA = 3;
export const mundo = (f: number) =>
  f - PAUSAS.reduce((s, p) => s + Math.min(Math.max(f - p, 0), PAUSA), 0);

type Curva = (t: number) => number;
type Ponto = [number, number, Curva?];
// Trilha de keyframes: cada trecho usa a curva do ponto de chegada; fora das pontas, segura o valor.
export const kf = (f: number, p: Ponto[]) => {
  if (f <= p[0][0]) return p[0][1];
  for (let i = 1; i < p.length; i++) {
    if (f <= p[i][0]) {
      const [f0, v0] = p[i - 1];
      const [f1, v1, curva] = p[i];
      if (f1 === f0) return v1;
      const t = (f - f0) / (f1 - f0);
      return v0 + (v1 - v0) * (curva ? curva(t) : t);
    }
  }
  return p[p.length - 1][1];
};

const sai = Easing.out(Easing.cubic);
const saiQ = Easing.out(Easing.quad);
const entraQ = Easing.in(Easing.quad);
const entra = Easing.in(Easing.cubic);
const volta = Easing.out(Easing.back(1.7));
const engole = Easing.in(Easing.back(1.8));

// Velocidades em unidades da faixa por quadro do mundo.
const V_CLAUDE = 0.95;
const V_FUGA = 0.65;

// Perseguição em unidades da faixa (centro dos bonecos; a barra vai de 146 a 380).
const REPOUSO_C = 170;
const REPOUSO_R = 232;
const bolsoCorre = (w: number) => REPOUSO_R + V_FUGA * (w - 167);
const POUSO_1 = bolsoCorre(209) - 18; // onde o Claudezinho cai no 1º bote
const LULA_SAI = POUSO_1 + 18;
const LULA_POUSA = LULA_SAI + 42;
const lulaCorre = (w: number) => LULA_POUSA + V_FUGA * (w - 264);
const POUSO_2 = lulaCorre(311) - 18;
const BOLSO_SAI = POUSO_2 + 18;
const BOLSO_POUSA = BOLSO_SAI + 42;

export type Boneco = { x: number; y: number; sx: number; sy: number; giro: number; vis: boolean; passo: number };
export type Claude = Boneco & { tampa: number; boca: boolean; piscar: boolean };
export type Estado = { c: Claude; bolso: Boneco; lula: Boneco };

const passo = (w: number, correndo: boolean) => Math.floor(w / (correndo ? 4 : 7));
const entre = (w: number, a: number, b: number) => w >= a && w < b;

// Voo de quem é cuspido: sai pequeno, gira de 90 em 90 graus no ar e pousa amassando.
const voo = (w: number, t0: number, x0: number, x1: number) => {
  const k = w - t0;
  return {
    x: kf(w, [[t0, x0], [t0 + 12, x1, sai]]),
    y: k >= 0 && k <= 12 ? -12 * Math.sin((Math.PI * k) / 12) : 0,
    s: kf(w, [[t0, 0.3], [t0 + 8, 1, volta]]),
    giro: k >= 0 && k < 12 ? Math.floor(k / 3) * 90 : 0,
    sx: kf(w, [[t0 + 12, 1], [t0 + 13, 1.14], [t0 + 18, 1, sai]]),
    sy: kf(w, [[t0 + 12, 1], [t0 + 13, 0.82], [t0 + 18, 1, sai]]),
  };
};

export const pose = (w: number): Estado => {
  // Claudezinho
  const cx = kf(w, [
    [167, REPOUSO_C],
    [175, REPOUSO_C + 4, entraQ],
    [192, REPOUSO_C + 4 + V_CLAUDE * 17],
    [201, REPOUSO_C + V_CLAUDE * 17, saiQ], // antecipação: recua antes do bote
    [209, POUSO_1, sai],
    [264, POUSO_1],
    [270, POUSO_1 + 3, entraQ],
    [300, POUSO_1 + 3 + V_CLAUDE * 30],
    [306, POUSO_1 + V_CLAUDE * 30, saiQ],
    [311, POUSO_2, sai],
    [351, POUSO_2],
    [357, POUSO_2 + 3, entraQ],
    [400, POUSO_2 + 3 + V_CLAUDE * 43],
  ]);
  const cy = kf(w, [[201, 0], [205, -8, saiQ], [209, 0, entraQ], [306, 0], [308.5, -6, saiQ], [311, 0, entraQ]]);
  // Mastigando: o corpo pulsa e a tampa treme (como no plugin).
  const mastiga = (a: number, b: number) => (entre(w, a, b) ? Math.abs(Math.sin((Math.PI * (w - a)) / 9)) : 0);
  const m = mastiga(214, 232) + mastiga(316, 325);
  const csx =
    kf(w, [
      [192, 1], [201, 1.12, saiQ], [204, 1.28, sai], [209, 1, sai],
      [210, 1], [212, 1.12], [218, 1, volta],
      [242, 1], [252, 1.1, saiQ], [254, 1.15], [262, 1, volta],
      [300, 1], [306, 1.1, saiQ], [308, 1.24, sai], [311, 1, sai],
      [312, 1], [314, 1.12], [320, 1, volta],
      [329, 1], [339, 1.1, saiQ], [341, 1.15], [349, 1, volta],
    ]) *
    (1 + 0.1 * m);
  const csy =
    kf(w, [
      [192, 1], [201, 0.86, saiQ], [204, 0.86], [209, 1, sai],
      [210, 1], [212, 0.86], [218, 1, volta],
      [242, 1], [252, 1.1, saiQ], [254, 0.9], [262, 1, volta],
      [300, 1], [306, 0.88, saiQ], [308, 0.88], [311, 1, sai],
      [312, 1], [314, 0.86], [320, 1, volta],
      [329, 1], [339, 1.1, saiQ], [341, 0.9], [349, 1, volta],
    ]) *
    (1 + 0.1 * m);
  const tampa =
    kf(w, [
      [159, 0], [163, -12, sai], [167, 0, entra], // lambe os beiços antes de sair correndo
      [192, 0], [201, -14, sai], [204, -38, sai], [207, -38], [210, 0, entra],
      [242, 0], [250, -16, saiQ], [253, -38, sai], [256, -38], [262, 0, entra],
      [297, 0], [306, -14, sai], [308, -38, sai], [309, -38], [312, 0, entra],
      [329, 0], [337, -16, saiQ], [340, -38, sai], [343, -38], [349, 0, entra],
    ]) - 10 * m;
  const boca = entre(w, 199, 210) || entre(w, 246, 262) || entre(w, 304, 312) || entre(w, 333, 349);
  const cCorre = entre(w, 167, 209) || entre(w, 264, 311) || w >= 351;

  // Bolsonaro: parado na barra, leva um susto, foge, é engolido e volta cuspido no fim.
  const bVoo = voo(w, 339, BOLSO_SAI, BOLSO_POUSA);
  const bolsoVivo = (w >= 150 && w < 211) || w >= 339;
  const bx = w < 339 ? kf(w, [[167, REPOUSO_R], [205, bolsoCorre(205)], [210, POUSO_1 + 16, entraQ]]) : w < 351 ? bVoo.x : BOLSO_POUSA + V_FUGA * (w - 351);
  const bs = w < 339 ? kf(w, [[150, 0], [156, 1, volta], [205, 1], [210, 0, engole]]) : bVoo.s;
  const bolso: Boneco = {
    x: bx,
    y: w < 339 ? kf(w, [[163, 0], [166, -5, saiQ], [169, 0, entraQ]]) : bVoo.y,
    sx: bs * (w < 339 ? 1 : bVoo.sx),
    sy: bs * (w < 339 ? 1 : bVoo.sy),
    giro: w < 339 ? 0 : bVoo.giro,
    vis: bolsoVivo,
    passo: passo(w + 2, entre(w, 167, 205) || w >= 351),
  };

  // Lula: sai cuspido no 1º ptui, foge tonto e vira o 2º prato.
  const lVoo = voo(w, 252, LULA_SAI, LULA_POUSA);
  const lx = w < 264 ? lVoo.x : kf(w, [[264, LULA_POUSA], [309, lulaCorre(309)], [312, POUSO_2 + 16, entraQ]]);
  const ls = w < 309 ? lVoo.s : kf(w, [[309, 1], [312, 0, engole]]);
  const tonto = entre(w, 264, 276) ? 8 * Math.sin(((w - 264) * Math.PI) / 3) * (1 - (w - 264) / 12) : 0;
  const lula: Boneco = {
    x: lx,
    y: w < 264 ? lVoo.y : 0,
    sx: ls * (w < 264 ? 1 : lVoo.sx),
    sy: ls * (w < 264 ? 1 : lVoo.sy),
    giro: w < 264 ? lVoo.giro : tonto,
    vis: w >= 252 && w < 313,
    passo: passo(w + 2, entre(w, 264, 309)),
  };

  return {
    c: { x: cx, y: cy, sx: csx, sy: csy, giro: 0, vis: true, passo: passo(w, cCorre), tampa, boca, piscar: false },
    bolso,
    lula,
  };
};

// Pontos da boca, para o texto e as migalhas.
export const boca = (e: Estado) => ({ x: e.c.x + 24, y: 22 + e.c.y });

// Tremor da tela (quadros reais): forte na mordida, leve na cuspida. Sempre em pixels inteiros.
const GOLPES: [number, number, number][] = [
  [NHAC_1, 16, 4],
  [PTUI_1, 7, 3],
  [NHAC_2, 16, 4],
  [PTUI_2, 7, 3],
];
export const tremor = (f: number) => {
  let dx = 0;
  let dy = 0;
  for (const [t, a, tau] of GOLPES) {
    const k = f - t;
    if (k < 0 || k > 18) continue;
    const amp = a * Math.exp(-k / tau);
    dx += amp * Math.sin(2.3 * k + 0.6);
    dy += 0.6 * amp * Math.cos(2.9 * k);
  }
  return { dx: Math.round(dx), dy: Math.round(dy) };
};

// Migalhas que voam da boca: quadrados de 2x2 na cor dos rostos e do Claudezinho.
const CORES_MIGALHA = ['#f19c88', '#d77763', '#df9d80', '#c57b64', '#d68a5f'];
export type Migalha = { x: number; y: number; cor: string; op: number };
export const migalhas = (f: number, origem: (t: number) => { x: number; y: number }): Migalha[] => {
  const out: Migalha[] = [];
  for (const [t, n] of [[NHAC_1, 4], [PTUI_1, 7], [NHAC_2, 4], [PTUI_2, 7]]) {
    const k = f - t;
    if (k < 0 || k > 20) continue;
    const o = origem(t);
    for (let i = 0; i < n; i++) {
      const vx = 0.6 + 1.4 * random(`mx${t}-${i}`);
      const vy = -0.5 - 1.7 * random(`my${t}-${i}`);
      let y = o.y + vy * k + 0.11 * k * k;
      if (y > 44) y = 44 - (y - 44) * 0.4; // quica uma vez na barra
      out.push({ x: o.x + vx * k, y, cor: CORES_MIGALHA[i % CORES_MIGALHA.length], op: k > 14 ? 1 - (k - 14) / 6 : 1 });
    }
  }
  return out;
};
