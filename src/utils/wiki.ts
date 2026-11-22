import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './paths';

export type Language = 'pt' | 'en';

type Entry = CollectionEntry<'wiki'>;

export interface WikiPage {
  slug: string;
  lang: Language;
  title: string;
  section: boolean;
  entry?: Entry;
}

const rootOrder = ['linux', 'security', 'networking', 'blockchain', 'music', 'cubo', 'barraco'];

export const labels = {
  pt: {
    home: 'Início', subjects: 'Assuntos', explore: 'Explorar por assunto',
    shortcuts: 'Acesso rápido', contents: 'Nesta página', about: 'Sobre a wiki',
    read: 'Notas para consultar, estudar e lembrar.',
    edit: 'Editar no GitHub', previous: 'Anterior', next: 'Próxima',
    list: 'Nesta seção', subsections: 'Subseções', notes: 'Notas', allTopics: 'Todos os assuntos',
    skip: 'Pular para o conteúdo', menu: 'Menu',
    search: 'Buscar na wiki', placeholder: 'Título ou termo', theme: 'Tema',
    themeOptions: { sistema: 'Sistema', escuro: 'Escuro', claro: 'Claro', areia: 'Areia' },
    empty: 'Nenhuma página encontrada.', loading: 'Carregando a busca…',
    searchError: 'A busca falhou. Feche e abra novamente para tentar de novo.',
    close: 'Fechar', missing: 'Página não encontrada', goHome: 'Voltar ao início',
  },
  en: {
    home: 'Home', subjects: 'Topics', explore: 'Explore by topic',
    shortcuts: 'Quick links', contents: 'On this page', about: 'About the wiki',
    read: 'Notes, cheatsheets, and things worth keeping.',
    edit: 'Edit on GitHub', previous: 'Previous', next: 'Next',
    list: 'In this section', subsections: 'Subsections', notes: 'Notes', allTopics: 'All topics',
    skip: 'Skip to content', menu: 'Menu',
    search: 'Search the wiki', placeholder: 'Title or keyword', theme: 'Theme',
    themeOptions: { sistema: 'System', escuro: 'Dark', claro: 'Light', areia: 'Sand' },
    empty: 'No pages found.', loading: 'Loading search…',
    searchError: 'Search failed. Close and reopen to try again.',
    close: 'Close', missing: 'Page not found', goHome: 'Return home',
  },
} as const;

const topicNames: Record<string, string> = {
  linux: 'Linux', security: 'Segurança', networking: 'Networking',
  blockchain: 'Blockchain', music: 'Música', cubo: 'Cubos mágicos', barraco: '/co',
};

export const topicIcons: Record<string, string> = {
  linux: 'terminal', security: 'shield', networking: 'globe', blockchain: 'key',
  music: 'music-note', cubo: 'cube', barraco: 'home',
};

export const repository = 'https://github.com/fguisso/wiki';

export function href(slug: string, lang: Language = 'pt') {
  const segments = [...(lang === 'en' ? ['en'] : []), ...slug.split('/').filter(Boolean)];
  return withBase(segments.length ? '/' + segments.join('/') + '/' : '/');
}

export function linksForMarkdown(path: string, lang: Language, pages: WikiPage[]) {
  if (!path.startsWith('/')) return path;
  const slug = path.replace(/^\/+|\/+$/g, '');
  return href(slug, pages.some((page) => page.lang === lang && page.slug === slug) ? lang : 'pt');
}

export function ancestorSlugs(slug: string) {
  const segments = slug ? slug.split('/') : [];
  return segments.map((_, index) => segments.slice(0, index).join('/'));
}

export function parentSlug(slug: string) {
  return slug.split('/').slice(0, -1).join('/');
}

export function childrenOf(pages: WikiPage[], slug: string, lang: Language) {
  return pages.filter((page) => page.lang === lang && page.slug && parentSlug(page.slug) === slug);
}

function position(slug: string) {
  const index = rootOrder.indexOf(slug);
  return index < 0 ? rootOrder.length : index;
}

export async function getWiki() {
  const entries = await getCollection('wiki', (entry) => !entry.data.draft);
  const pages = new Map<string, WikiPage>();
  for (const entry of entries) {
    const lang: Language = entry.id.endsWith('.en.md') ? 'en' : 'pt';
    const file = entry.id.replace(/(?:\.en)?\.md$/, '').toLowerCase();
    const section = file.split('/').at(-1) === '_index';
    const slug = section ? parentSlug(file) : file;
    pages.set(href(slug, lang), {
      slug, lang, section, entry, title: entry.data.title || 'Garden Wiki',
    });
  }

  for (const page of [...pages.values()]) {
    for (const slug of ancestorSlugs(page.slug)) {
      const path = href(slug, page.lang);
      if (pages.has(path)) continue;
      const existing = pages.get(href(slug));
      const segment = slug.split('/').at(-1) ?? '';
      const title = topicNames[slug] ?? existing?.title ?? segment.replace(/(^|-)(\w)/g, (_, before, letter) =>
        (before ? ' ' : '') + letter.toUpperCase()
      );
      pages.set(path, { slug, lang: page.lang, title, section: true });
    }
  }

  return [...pages.values()].sort((a, b) =>
    position(a.slug) - position(b.slug)
    || (a.entry?.data.weight ?? Infinity) - (b.entry?.data.weight ?? Infinity)
    || a.title.localeCompare(b.title, a.lang === 'pt' ? 'pt-BR' : 'en')
  );
}

export function shortTitle(page: WikiPage) {
  return page.lang === 'pt' ? topicNames[page.slug] ?? page.title : page.title;
}
