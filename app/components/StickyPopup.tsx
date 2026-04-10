'use client';

import { useState, useEffect } from 'react';

export default function StickyPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hideUntil = localStorage.getItem('choksense_popup_hide');
    if (hideUntil && Date.now() < Number(hideUntil)) return;
    const t = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const hideToday = () => {
    localStorage.setItem('choksense_popup_hide', String(Date.now() + 86400000));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[300px] z-50 shadow-xl">
      <div className="bg-white border border-[#E0E0E0] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-xs font-black">투자센스</span>
            <span className="text-[10px] text-[#CCC]">부산 부동산</span>
          </div>
          <button onClick={() => setVisible(false)} className="text-[#CCC] hover:text-[#1A1A1A] text-xl leading-none">×</button>
        </div>
        <div className="px-4 py-4">
          <p className="text-[11px] text-[#AAA] mb-1">지금 부산 실거래 흐름이 궁금하다면</p>
          <p className="text-base font-black text-[#1A1A1A] mb-4 leading-snug">데이터로 확인하세요.</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { v: '실시간', l: '오늘 거래' },
              { v: '자동', l: '신고가 추적' },
              { v: '무료', l: '이용 요금' },
            ].map(s => (
              <div key={s.l} className="bg-[#F7F7F5] py-2 text-center border border-[#EEE]">
                <div className="text-sm font-black text-[#1A1A1A]">{s.v}</div>
                <div className="text-[10px] text-[#AAA] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
          <a href="https://2sen.co.kr" target="_blank" rel="noopener noreferrer"
            className="block w-full bg-[#1A1A1A] text-white text-sm font-black text-center py-3 hover:bg-[#333] transition-colors mb-2">
            부산 실거래 무료 확인 →
          </a>
          <div className="grid grid-cols-2 gap-2">
            <a href="https://open.kakao.com/o/gsoZYvih" target="_blank" rel="noopener noreferrer"
              className="block bg-[#FEE500] text-[#1A1A1A] text-xs font-black text-center py-2 hover:opacity-80 transition-opacity">
              카카오 오픈톡
            </a>
            <a href="https://instagram.com/choksense1" target="_blank" rel="noopener noreferrer"
              className="block border border-[#EEE] text-[#888] text-xs font-bold text-center py-2 hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors">
              인스타그램
            </a>
          </div>
        </div>
        <div className="px-4 pb-3 text-center">
          <button onClick={hideToday} className="text-[10px] text-[#CCC] hover:text-[#888] transition-colors">
            오늘 하루 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
}
