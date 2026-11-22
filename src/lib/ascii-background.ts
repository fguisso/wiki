import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { asciiBackgroundCompositions, asciiCanvas, asciiGlyph, asciiShape, asciiSvg, type AsciiShape } from './ascii-background-shapes';

export type ArticleArtTone = 'green' | 'purple';

export interface AsciiBackgroundScene {
  tone: ArticleArtTone;
  shapes: readonly AsciiShape[];
}

// Leave room between silhouettes as more shapes enter the composition.
const layouts = [
  { size: 48, points: [[199, 81]] },
  { size: 39, points: [[99, 90], [233, 72]] },
  { size: 29, points: [[57, 94], [162, 69], [267, 90]] },
] as const;

export function asciiBackgroundScene(title: string): AsciiBackgroundScene {
  const seed = createHash('sha256').update(title.trim().normalize('NFC')).digest();
  const tone = seed[0] % 2 === 0 ? 'green' : 'purple';
  const [triangles, circles] = asciiBackgroundCompositions[seed.readUInt16BE(1) % asciiBackgroundCompositions.length];
  const kinds: AsciiShape['kind'][] = [
    ...Array.from({ length: triangles }, () => 'triangle' as const),
    ...Array.from({ length: circles }, () => 'circle' as const),
  ];
  for (let index = kinds.length - 1; index > 0; index--) {
    const swap = seed[3 + index] % (index + 1);
    [kinds[index], kinds[swap]] = [kinds[swap], kinds[index]];
  }

  const { size, points } = layouts[kinds.length - 1];
  const shapes = kinds.map((kind, index): AsciiShape => {
    const [x, y] = points[index];
    const offset = 7 + index * 6;
    const shapeSize = size + seed[offset + 2] % 18;
    const stroke = 4 + seed[offset + 5] % 3;
    const margin = Math.ceil(shapeSize + stroke / 2) + 1;
    return {
      kind,
      x: Math.max(margin, Math.min(asciiCanvas.width - margin, x + seed[offset] % 17 - 8)),
      y: Math.max(margin, Math.min(asciiCanvas.height - margin, y + seed[offset + 1] % 13 - 6)),
      size: shapeSize,
      rotation: kind === 'triangle' ? seed[offset + 3] % 180 - 90 : 0,
      fill: seed[offset + 4] % 2 === 0 ? 0 : 40 + seed[offset + 4] % 31,
      stroke,
    };
  });

  return { tone, shapes };
}

export async function renderAsciiBackground(shapes: readonly AsciiShape[]): Promise<string> {
  const { columns, rows } = asciiCanvas;
  const svg = asciiSvg(shapes.map(asciiShape).join(''), asciiCanvas);
  const { data, info } = await sharp(Buffer.from(svg))
    .resize(columns, rows, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Each ASCII cell represents the coverage of one SVG sample.
  const frame = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, column) => {
      const pixel = (row * columns + column + 1) * info.channels - 1;
      const coverage = data[pixel] / 255;
      return asciiGlyph(coverage);
    }).join('').trimEnd()
  );

  const first = frame.findIndex((row) => row.length > 0);
  if (first === -1) return '';
  const cropped = frame.slice(first, frame.findLastIndex((row) => row.length > 0) + 1);
  const inset = Math.min(...cropped.filter(Boolean).map((row) => row.search(/\S/)));
  return cropped.map((row) => row.slice(inset)).join('\n');
}
