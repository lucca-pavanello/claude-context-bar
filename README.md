# Claude Context Bar

Uma barra fixa acima do prompt do Claude Code que muda o jeito de usar: você para de adivinhar quando o chat ficou pesado.

- **Contexto usado:** uma barra que enche conforme o chat consome a janela de contexto, com uma marca no ponto ideal de compactar (45%).
- **Tempo de chat:** há quanto tempo a conversa está aberta.
- **Hora do /clear:** passou de 6 horas, a barra avisa **⚠ /clear**. Chat velho fica lento, caro e começa a esquecer coisas; recomeçar limpo resolve.

Funciona no Code do app desktop (barra animada) e no terminal (versão em texto).

## Instalar

Abra o Claude Code **no terminal** (`claude`) e digite no prompt:

```
/plugin install claude-context-bar --marketplace lucca-pavanello/claude-context-bar
```

Responda `y` para adicionar o marketplace e escolha o escopo de usuário (Enter). A barra aparece na hora e em todas as próximas sessões, inclusive no app desktop.

> No Code do app desktop o comando `/plugin` não existe, por isso a instalação é pelo terminal. Depois de instalado, vale para os dois.

## Recomendado: compactar em 45%

Por padrão o Claude só compacta o chat quando a janela está quase cheia, e aí a qualidade já caiu. Para ele compactar sozinho na marca da barra, coloque isto em `~/.claude/settings.json`:

```json
{
  "env": { "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "45" }
}
```

## Atualizar e remover

```
/plugin update claude-context-bar
/plugin uninstall claude-context-bar
```

## Créditos

Feito por Lucca Pavanello com o Claude Code. Créditos das imagens no código (`hooks/register.tsx`).
