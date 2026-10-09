# Vídeo de divulgação

Vídeo de 15 s do claude-context-bar, feito em [Remotion](https://www.remotion.dev): a barra compacta
em 45%, avisa a hora do /clear e, de bônus, o Claudezinho come e cospe quem estiver na faixa.

Esta pasta mora só na branch `feat/video-divulgacao`. Não vai para a `main`, porque a `main` é
copiada inteira para quem instala o plugin.

## Rodar

```bash
npm i
npm run dev              # Remotion Studio, para ver e ajustar
npm run render:vertical  # out/claude-context-bar-9x16.mp4 (1080x1920)
npm run render:feed      # out/claude-context-bar-4x5.mp4 (1080x1350)
```

Sem trilha, só com os efeitos: `npx remotion render Vertical out/bruto.mp4 --props='{"trilha":false}'`
e depois `node scripts/masterizar.mjs out/bruto.mp4 out/final.mp4`.

`scripts/masterizar.mjs` nivela o áudio em -16,5 LUFS (pico -1 dBTP) sem mexer no vídeo.

## Onde mexer

| Arquivo | O que tem |
| --- | --- |
| `src/coreo.ts` | os tempos da perseguição: bote, mordida, cuspida, quadro congelado |
| `src/Promo.tsx` | a câmera e a montagem das camadas |
| `src/Faixa.tsx` | a faixa do plugin, quadro a quadro |
| `src/Legendas.tsx` | os textos na tela |
| `src/Som.tsx` | a trilha e os efeitos |
| `src/layout.ts` | posições do 9:16 e do 4:5 |

A arte (Claudezinho e rostos) é copiada de `hooks/register.tsx`. Trilha e efeitos gerados no Magnific
(ElevenLabs). Foto do Lula: Palácio do Planalto, CC BY 2.0.
