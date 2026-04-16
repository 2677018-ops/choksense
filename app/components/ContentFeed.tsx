import { headers } from 'next/headers';

interface ContentItem {
  id: string;
  title: string;
  link: string;
  thumbnail?: string | null;
  date: string;
  summary: string;
  source: string;
  type: 'youtube' | 'blog' | 'cafe';
  views?: number;
}

interface CarouselSet {
  id: string;
  title: string;
  date: string;
  images: string[];
  count: number;
  instagram_url?: string;
  category?: string;
}

const CAT_LABELS: Record<string, string> = {
  insight: '촉센세 인사이트',
  kb_weekly: 'KB 주간 시세',
  weekly_report: '주간 레포트',
  daily: '일일 실거래',
  redevelopment: '재개발 현황',
};

const R2_PUBLIC = 'https://pub-977d97f056d54b90a43eea57f035a326.r2.dev';

async function getCarousels(): Promise<CarouselSet[]> {
  try {
    const res = await fetch(`${R2_PUBLIC}/data/carousel-index.json`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getContent() {
  try {
    const host = (await headers()).get('host') ?? 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const res = await fetch(`${protocol}://${host}/api/content`, { next: { revalidate: 1800 } });
    if (!res.ok) return { youtube: [], blogs: [], cafe: [] };
    return res.json();
  } catch {
    return { youtube: [], blogs: [], cafe: [] };
  }
}

function formatDate(d: string) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return d; }
}

function YoutubeCard({ item }: { item: ContentItem }) {
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="border border-[#E8E8E8] overflow-hidden hover:shadow-md transition-shadow bg-white">
        <div className="relative aspect-video bg-[#F0F0F0] overflow-hidden">
          {item.thumbnail
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={item.thumbnail} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="w-full h-full bg-[#E8E8E8]" />
          }
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-[#FF0000] transition-colors">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-[#FF0000] uppercase tracking-wide">YouTube</span>
            <span className="text-[10px] text-[#BBB]">{item.source}</span>
          </div>
          <h3 className="text-sm font-black text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-[#555] transition-colors">{item.title}</h3>
          <div className="text-[11px] text-[#CCC] mt-1.5">{formatDate(item.date)}</div>
        </div>
      </div>
    </a>
  );
}

function BlogCard({ item }: { item: ContentItem }) {
  const isCafe = item.type === 'cafe';
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer"
      className="flex items-start gap-3 py-3.5 border-b border-[#F0F0F0] last:border-0 group hover:bg-[#FAFAFA] -mx-3 px-3 transition-colors">
      <div className="shrink-0 w-[120px] h-[80px] bg-[#F0F0F0] overflow-hidden">
        {item.thumbnail
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={item.thumbnail} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-[#CCC]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-[10px] font-black ${isCafe ? 'text-[#03C75A]' : 'text-[#888]'}`}>
            {isCafe ? '카페' : '블로그'}
          </span>
          <span className="text-[10px] text-[#CCC]">{item.source}</span>
          {(item.views ?? 0) > 500 && (
            <span className="text-[10px] text-[#CCC]">조회 {item.views!.toLocaleString()}</span>
          )}
        </div>
        <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-[#555] transition-colors">{item.title}</h3>
        <div className="text-[11px] text-[#CCC] mt-0.5">{formatDate(item.date)}</div>
      </div>
    </a>
  );
}

function SectionHeader({ title, href, linkText }: { title: string; href?: string; linkText?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-base font-black whitespace-nowrap">{title}</h2>
      <div className="flex-1 h-px bg-[#EEE]" />
      {href && (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-[11px] text-[#BBB] hover:text-[#1A1A1A] transition-colors whitespace-nowrap">
          {linkText ?? '전체 보기 →'}
        </a>
      )}
    </div>
  );
}

function CarouselGroup({ title, sets }: { title: string; sets: CarouselSet[] }) {
  if (!sets.length) return null;
  return (
    <section>
      <SectionHeader title={title} href="https://instagram.com/choksense1" linkText="Instagram →" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {sets.map((set) => (
          <a key={set.id} href={set.instagram_url || 'https://instagram.com/choksense1'} target="_blank" rel="noopener noreferrer"
            className="relative aspect-[4/5] overflow-hidden rounded-lg group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={set.images[0]}
              alt={set.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-[13px] sm:text-[15px] font-black leading-tight line-clamp-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{set.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/40 text-[10px]">{set.date}</span>
                {set.count > 1 && <span className="text-white/40 text-[10px]">{set.count}장</span>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function groupByCategory(sets: CarouselSet[]) {
  const groups: Record<string, CarouselSet[]> = {};
  for (const s of sets) {
    const cat = s.category || 'insight';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  }
  return groups;
}

export default async function ContentFeed() {
  const [{ youtube, blogs, cafe }, carousels] = await Promise.all([
    getContent(),
    getCarousels(),
  ]);

  const catGroups = groupByCategory(carousels);
  // 표시 순서: KB주간 → 주간레포트 → 일일 → 재개발 → 인사이트
  const catOrder = ['kb_weekly', 'weekly_report', 'daily', 'redevelopment', 'insight'];

  return (
    <div className="space-y-10">
      {/* 1. 유튜브 */}
      {youtube?.length > 0 && (
        <section id="youtube">
          <SectionHeader title="최신 영상" href="https://www.youtube.com/@Chok.sense1" linkText="채널 보기 →" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtube.map((item: ContentItem) => <YoutubeCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {/* 2. 인스타 캐러셀 (카테고리별) */}
      {catOrder.map(cat => (
        <CarouselGroup
          key={cat}
          title={CAT_LABELS[cat] || cat}
          sets={(catGroups[cat] || []).slice(0, 5)}
        />
      ))}

      {blogs?.length > 0 && (
        <section id="blog">
          <SectionHeader title="블로그 최신글" />
          <div className="bg-white border border-[#EEE] px-3">
            {blogs.map((item: ContentItem) => <BlogCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {cafe?.length > 0 && (
        <section id="cafe">
          <SectionHeader title="카페 인기글" />
          <div className="bg-white border border-[#EEE] px-3">
            {cafe.map((item: ContentItem) => <BlogCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {!youtube?.length && !blogs?.length && !cafe?.length && (
        <div className="text-center py-20 text-[#CCC] text-sm">콘텐츠를 불러오는 중입니다.</div>
      )}
    </div>
  );
}
