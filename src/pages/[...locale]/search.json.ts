import type { APIRoute } from 'astro';
import { getWiki, href, shortTitle, type Language } from '../../utils/wiki';

export function getStaticPaths() {
  return [
    { params: { locale: undefined }, props: { lang: 'pt' } },
    { params: { locale: 'en' }, props: { lang: 'en' } },
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const lang = props.lang as Language;
  const pages = await getWiki();
  const index = pages.filter((page) => page.lang === lang && page.slug).map((page) => {
    const source = page.entry?.body ?? '';
    const plainText = (text: string) => text
      .replace(/^\s*-{3,}\s*$/gm, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/!?(\[[^\]]*\])\([^)]*\)/g, '$1')
      .replace(/[\[\]#*_~`]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const body = plainText(source);
    const firstParagraph = source.split(/\n\s*\n/).map((part) => part.trim()).find((part) =>
      part && !/^(?:#|[<>`]|---)/.test(part)
    );
    const preview = plainText(firstParagraph ?? body);
    const summary = preview.length > 155 ? preview.slice(0, 155).replace(/\s+\S*$/, '') + '…' : preview;

    return {
      title: page.title,
      url: href(page.slug, lang),
      group: shortTitle(pages.find((parent) => parent.lang === lang && parent.slug === page.slug.split('/')[0]) ?? page),
      summary: page.entry?.data.description || summary,
      body,
    };
  });

  return Response.json(index);
};
