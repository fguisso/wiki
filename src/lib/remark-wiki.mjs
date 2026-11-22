const embedNames = [
  ['/gube/', 'Simulador de cubo mágico'],
  ['/groove/', 'Groove'],
  ['/GrooveScribe/', 'GrooveScribe'],
  ['open.spotify.com/', 'Spotify'],
];

export default function remarkWiki({ base }) {
  const prefix = base === '/' ? '' : base;

  return function transform(tree) {
    function visit(node) {
      if (node.type === 'heading' && node.depth === 1) node.depth = 2;

      if (typeof node.url === 'string' && /^\/(?!\/)/.test(node.url)) {
        node.url = prefix + node.url;
      }

      if (node.type === 'blockquote') {
        const first = node.children[0]?.children?.[0];
        if (first?.type === 'text' && first.value.startsWith('[!WARNING]\n')) {
          first.value = first.value.slice('[!WARNING]\n'.length);
          node.data = { ...node.data, hProperties: { class: 'wiki-warning' } };
        }
      }

      if (node.type === 'html') {
        node.value = node.value.replace(/<iframe\b([^>]*)>/gi, (tag, attributes) => {
          const source = attributes.match(/\bsrc=["']([^"']+)["']/i)?.[1];
          if (!source) return tag;

          const title = embedNames.find(([url]) => source.includes(url))?.[1] ?? 'Conteúdo interativo';
          if (!/\btitle=/.test(attributes)) attributes += ` title="${title}"`;
          if (!/\bloading=/.test(attributes)) attributes += ' loading="lazy"';
          return `<iframe${attributes}>`;
        });
      }

      node.children?.forEach(visit);
    }

    visit(tree);
  };
}
