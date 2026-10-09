// Ajusta o volume do MP4 com um ganho fixo (até -16,5 LUFS, sem estourar o pico), sem recodificar o vídeo.
// Uso: node scripts/masterizar.mjs out/entrada.mp4 out/saida.mp4
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// O ffmpeg que vem com o Remotion, chamado pelo próprio CLI dele (sem shell, funciona no Windows e no resto).
const cli = fileURLToPath(new URL('../node_modules/@remotion/cli/remotion-cli.js', import.meta.url));

const [entrada, saida] = process.argv.slice(2);
if (!entrada || !saida) {
  console.error('uso: node scripts/masterizar.mjs <entrada.mp4> <saida.mp4>');
  process.exit(1);
}

const ffmpeg = (args) => {
  const r = spawnSync(process.execPath, [cli, 'ffmpeg', '-hide_banner', ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(r.stderr);
  return r.stderr;
};

// Ganho fixo, sem compressor. O loudnorm em modo linear desiste quando a faixa dinâmica é larga (versão sem trilha)
// e passa a gerar pico; o volume puro não. O teto de -1,5 dBTP é antes do AAC, que soma ~1 dB no pico (sai perto de -0,5).
const ALVO_LUFS = -16.5;
const TETO_DBTP = -1.5;
const log = ffmpeg(['-i', entrada, '-vn', '-af', 'loudnorm=print_format=json', '-f', 'null', '-']);
const m = JSON.parse(log.slice(log.lastIndexOf('{'), log.lastIndexOf('}') + 1));
const ganho = Math.min(ALVO_LUFS - Number(m.input_i), TETO_DBTP - Number(m.input_tp));
ffmpeg(['-y', '-i', entrada, '-c:v', 'copy', '-af', `volume=${ganho.toFixed(2)}dB`, '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', saida]);
console.log(`${saida}: antes ${m.input_i} LUFS / ${m.input_tp} dBTP, ganho ${ganho.toFixed(2)} dB`);
