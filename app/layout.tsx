import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "촉센스 | 부산 부동산 투자 정보",
  description: "부산 부동산 실거래, 재개발, 청약, 투자 인사이트. 투자센스 공식 채널 모음.",
  keywords: "부산 부동산, 재개발, 청약, 실거래가, 투자, 해운대, 수영구, 동래, 광안리",
  openGraph: {
    title: "촉센스 | 부산 부동산 투자 정보",
    description: "부산 부동산 실거래, 재개발, 청약 정보 모음",
    url: "https://choksense.com",
    siteName: "촉센스",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[#F5F4F1] text-[#1A1A1A] antialiased">
        {children}
      </body>
    </html>
  );
}
