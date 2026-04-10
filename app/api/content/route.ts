import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
});

// ── HTML에서 첫번째 이미지 URL 추출 ────────────────────────
function extractImage(html: string): string | null {
  const m = html?.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function stripHtml(html: string): string {
  return (html ?? '').replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
}

// ── 네이버 블로그 RSS ────────────────────────────────────────
async function fetchRSS(url: string, source: string) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const data = parser.parse(xml);
    const items = data?.rss?.channel?.item ?? data?.feed?.entry ?? [];
    const list = Array.isArray(items) ? items : [items];

    return list.slice(0, 10).map((item: any) => {
      const descRaw = item.description?.['__cdata'] ?? item.description ?? '';
      const thumbnail = extractImage(descRaw)
        ?? item['media:thumbnail']?.['@_url']
        ?? item.enclosure?.['@_url']
        ?? null;

      return {
        id: item.guid?.['#text'] ?? item.guid?.['__cdata'] ?? item.link ?? '',
        title: item.title?.['__cdata'] ?? item.title ?? '',
        link: item.link?.['@_href'] ?? item.link ?? '',
        date: item.pubDate ?? item.published ?? '',
        summary: stripHtml(descRaw).slice(0, 120),
        thumbnail,
        source,
        type: 'blog' as const,
      };
    });
  } catch {
    return [];
  }
}

// ── 유튜브 (public/youtube.json 정적 파일) ──────────────────
async function fetchYoutube(_channelId: string) {
  try {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const filePath = join(process.cwd(), 'public', 'youtube.json');
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw).slice(0, 12);
  } catch {
    return [];
  }
}

// ── 네이버 카페 ──────────────────────────────────────────────
async function fetchNaverCafe(cafeId: string) {
  try {
    const url = `https://cafe.naver.com/f-e/cafes/${cafeId}/articles?page=1&perPage=15&boardType=L`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://cafe.naver.com',
        'Accept': 'application/json',
      },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = json?.articleList ?? json?.list ?? [];
    return items.slice(0, 10).map((item: any) => ({
      id: String(item.articleId ?? item.id ?? ''),
      title: item.subject ?? item.title ?? '',
      link: `https://cafe.naver.com/f-e/cafes/${cafeId}/articles/${item.articleId ?? item.id}`,
      date: item.writeDateTimestamp
        ? new Date(item.writeDateTimestamp).toISOString()
        : (item.writeDate ?? ''),
      summary: stripHtml(item.summary ?? item.content ?? '').slice(0, 120),
      thumbnail: item.representImage ?? item.image ?? null,
      views: item.readCount ?? 0,
      source: '촉센세 카페',
      type: 'cafe' as const,
    }));
  } catch {
    return [];
  }
}

// ── GET ──────────────────────────────────────────────────────
export async function GET() {
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? 'UC9-z8owGUNFFIeLUXAYntsQ';
  const CAFE_ID = '19994344';

  const [youtube, blog1, blog2, cafe] = await Promise.allSettled([
    fetchYoutube(YOUTUBE_CHANNEL_ID),
    fetchRSS('https://rss.blog.naver.com/1min_investor.xml', '1분투자자'),
    fetchRSS('https://rss.blog.naver.com/dok2mom.xml', '독투맘'),
    fetchNaverCafe(CAFE_ID),
  ]);

  const get = (r: PromiseSettledResult<any[]>) =>
    r.status === 'fulfilled' ? r.value : [];

  return NextResponse.json({
    youtube: get(youtube),
    blogs: [...get(blog1), ...get(blog2)].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    cafe: get(cafe),
  });
}
