import { expect, test } from 'claude-code/testing'

const H = 3600000
const AGORA = 1_800_000_000_000

// Lê texto e o SVG de uma árvore desenhada.
const texto = (n: unknown): string =>
  n == null || typeof n === 'boolean' ? '' :
  typeof n === 'string' || typeof n === 'number' ? String(n) :
  Array.isArray(n) ? n.map(texto).join('') :
  texto((n as { children?: unknown }).children) + ((n as { props?: { source?: string } }).props?.source ?? '')

test('desktop: faixa SVG com Claudezinho, barra e dados', async ($, on) => {
  on('clock.now', () => ({ value: AGORA }))
  on('session.usage', () => ({ value: { startedAt: AGORA - 1.5 * H, context: { window: 1000000, percent: 22.4 }, rateLimits: [] } }))
  on('ui.render', ($: any, e: any) => { const { Box } = $.ui.resolve(e); return <Box /> })
  const t = texto(await $.ui.render({ component: 'AbovePrompt', surface: 'desktop', props: { hasSurvey: false } } as never))
  expect(t).toContain('<svg')
  expect(t).toContain('Fã do Lucca')
  expect(t).toContain('22% · 1h30')
  expect(t).toContain('class="bob"')
  expect(t).not.toContain('/clear')
})

test('terminal: faixa em texto com a mesma informação', async ($, on) => {
  on('clock.now', () => ({ value: AGORA }))
  on('session.usage', () => ({ value: { startedAt: AGORA - 1.5 * H, context: { window: 1000000, percent: 22.4 }, rateLimits: [] } }))
  on('ui.render', ($: any, e: any) => { const { Box } = $.ui.resolve(e); return <Box /> })
  const t = texto(await $.ui.render({ component: 'AbovePrompt', surface: 'terminal', props: { hasSurvey: false } } as never))
  expect(t).toContain('Fã do Lucca')
  expect(t).toContain('22% · 1h30')
})

test('chat com mais de 6h avisa o /clear', async ($, on) => {
  on('clock.now', () => ({ value: AGORA }))
  on('session.usage', () => ({ value: { startedAt: AGORA - 7 * H, context: { window: 1000000, percent: 30 }, rateLimits: [] } }))
  on('ui.render', ($: any, e: any) => { const { Box } = $.ui.resolve(e); return <Box /> })
  const t = texto(await $.ui.render({ component: 'AbovePrompt', surface: 'desktop', props: { hasSurvey: false } } as never))
  expect(t).toContain('⚠ /clear · 7h00')
})

test('com pesquisa aberta a faixa some', async ($, on) => {
  on('ui.render', ($: any, e: any) => { const { Box } = $.ui.resolve(e); return <Box /> })
  const t = texto(await $.ui.render({ component: 'AbovePrompt', surface: 'terminal', props: { hasSurvey: true } } as never))
  expect(t).not.toContain('Fã do Lucca')
})
