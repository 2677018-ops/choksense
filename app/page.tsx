import { Suspense } from 'react';
import ContentFeed from './components/ContentFeed';
import StickyPopup from './components/StickyPopup';

export const revalidate = 1800;

export default function Home() {
  return (
    <>
      {/* 헤더 */}
      <header className="bg-white border-b-2 border-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-xl font-black tracking-tight">촉센스</span>
            <span className="text-xs text-[#999] ml-2 hidden sm:inline">부산 부동산 투자 정보</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://open.kakao.com/o/gsoZYvih" target="_blank" rel="noopener noreferrer"
              className="hidden sm:block text-xs font-bold bg-[#FEE500] text-[#1A1A1A] px-3 py-1.5 hover:opacity-80 transition-opacity">
              오픈톡
            </a>
            <a href="https://2sen.co.kr" target="_blank" rel="noopener noreferrer"
              className="text-xs font-black bg-[#1A1A1A] text-white px-4 py-1.5 hover:bg-[#333] transition-colors">
              실거래 확인 →
            </a>
          </div>
        </div>
        <div className="border-t border-[#EEE]">
          <div className="max-w-5xl mx-auto px-4 flex gap-5 text-xs text-[#888] overflow-x-auto py-2">
            {[
              ['#youtube', '영상'],
              ['#blog', '블로그'],
              ['#cafe', '카페글'],
              ['https://2sen.co.kr', '실거래 분석'],
              ['https://2sen.co.kr/redevelopment', '재개발'],
              ['https://2sen.co.kr/subscription-center', '청약'],
            ].map(([href, label]) => (
              <a key={href} href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="whitespace-nowrap hover:text-[#1A1A1A] font-medium transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="bg-[#1A1A1A] text-white px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] text-[#666] mb-2 tracking-widest uppercase font-medium">Busan Real Estate</p>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-3">
            부산 부동산,<br />감이 아닌 데이터로.
          </h1>
          <p className="text-[#888] text-sm mb-6 max-w-md">
            실거래 분석 · 재개발 현황 · 청약 타이밍.<br />
            투자센스 채널의 모든 콘텐츠를 한곳에서.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://2sen.co.kr" target="_blank" rel="noopener noreferrer"
              className="bg-white text-[#1A1A1A] text-sm font-black px-5 py-2.5 hover:bg-[#EEE] transition-colors">
              실거래 데이터 바로가기 →
            </a>
            <a href="https://open.kakao.com/o/gsoZYvih" target="_blank" rel="noopener noreferrer"
              className="bg-[#FEE500] text-[#1A1A1A] text-sm font-black px-5 py-2.5 hover:opacity-90 transition-opacity">
              카카오 오픈톡 참여
            </a>
            <a href="https://instagram.com/choksense1" target="_blank" rel="noopener noreferrer"
              className="border border-[#444] text-[#888] text-sm font-bold px-5 py-2.5 hover:border-white hover:text-white transition-colors">
              @choksense1
            </a>
          </div>
        </div>
      </section>

      {/* 콘텐츠 */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Suspense fallback={<FeedSkeleton />}>
          <ContentFeed />
        </Suspense>
      </main>

      {/* 중간 CTA */}
      <section className="bg-[#F7F7F5] border-y border-[#EEE] py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-lg font-black">부산 실거래, 직접 확인하세요.</div>
            <div className="text-sm text-[#888] mt-1">신고가 · 재개발 · 청약 · 회복률 한눈에.</div>
          </div>
          <a href="https://2sen.co.kr" target="_blank" rel="noopener noreferrer"
            className="shrink-0 bg-[#1A1A1A] text-white font-black text-sm px-6 py-3 hover:bg-[#333] transition-colors">
            2sen.co.kr →
          </a>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-[#EEE] py-8 px-4 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="font-black text-sm">촉센스</div>
            <div className="text-xs text-[#BBB] mt-0.5">choksense.com · 부산 부동산 투자 정보</div>
          </div>
          <div className="flex gap-4 text-xs text-[#BBB]">
            {[
              ['https://2sen.co.kr', '2sen.co.kr'],
              ['https://www.youtube.com/@Chok.sense1', 'YouTube'],
              ['https://blog.naver.com/1min_investor', '블로그'],
              ['https://instagram.com/choksense1', 'Instagram'],
            ].map(([href, label]) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="hover:text-[#1A1A1A] transition-colors">{label}</a>
            ))}
          </div>
        </div>
      </footer>

      <StickyPopup />
    </>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-52 bg-[#F0F0F0] rounded" />)}
      </div>
      <div className="h-40 bg-[#F0F0F0] rounded" />
    </div>
  );
}
