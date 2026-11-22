# Garden Wiki em Astro

Notas, tutoriais e referências da [Garden Wiki](https://wiki.guisso.dev/), de Fernando Guisso.

```sh
npm ci
npm run dev
```

O conteúdo fica em `src/content/wiki/`. Use `_index.md` para criar a página de uma seção, `nome.md` para uma nota e o sufixo `.en.md` para traduções. As páginas marcadas com `draft: true` ficam fora do site. O campo `aliases` mantém URLs antigas, e `toc: false` oculta o sumário.

Imagens de uma nota podem ficar ao lado do Markdown. Imagens compartilhadas ficam em `public/images/`. Os atalhos da home ficam no campo `cards` dos dois arquivos de entrada.

```sh
npm run build
npm run test:e2e
```

O Astro gera o site estático em `dist/`. Para servir em um subdiretório, use `SITE_URL=https://exemplo.com/wiki/ npm run build`. O conteúdo usa a licença CC BY-SA 4.0.
