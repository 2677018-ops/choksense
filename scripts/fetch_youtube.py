# -*- coding: utf-8 -*-
"""유튜브 채널 영상 목록을 public/youtube.json에 저장"""
import urllib.request, re, json, os

CHANNEL_ID = "UC9-z8owGUNFFIeLUXAYntsQ"
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'youtube.json')

def fetch():
    url = f'https://www.youtube.com/channel/{CHANNEL_ID}/videos'
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'ko-KR,ko;q=0.9',
    })
    html = urllib.request.urlopen(req).read().decode('utf-8')

    # ytInitialData JSON 블록 추출
    m = re.search(r'var ytInitialData = (\{.*?\});</script>', html, re.DOTALL)
    if not m:
        # 대체: videoId만 추출
        ids = list(dict.fromkeys(re.findall(r'"videoId":"([A-Za-z0-9_-]{11})"', html)))[:12]
        return [{'id': v, 'title': '', 'link': f'https://www.youtube.com/watch?v={v}',
                 'thumbnail': f'https://img.youtube.com/vi/{v}/hqdefault.jpg',
                 'date': '', 'source': '투자센스TV', 'type': 'youtube'} for v in ids]

    data = json.loads(m.group(1))

    videos = []
    try:
        tabs = data['contents']['twoColumnBrowseResultsRenderer']['tabs']
        for tab in tabs:
            tab_content = tab.get('tabRenderer', {}).get('content', {})
            section = tab_content.get('richGridRenderer', {}).get('contents', [])
            for item in section:
                ri = item.get('richItemRenderer', {}).get('content', {})
                vr = ri.get('videoRenderer', {})
                if not vr:
                    continue
                vid = vr.get('videoId', '')
                title = vr.get('title', {}).get('runs', [{}])[0].get('text', '')
                date = vr.get('publishedTimeText', {}).get('simpleText', '')
                if vid:
                    videos.append({
                        'id': vid,
                        'title': title,
                        'link': f'https://www.youtube.com/watch?v={vid}',
                        'thumbnail': f'https://img.youtube.com/vi/{vid}/hqdefault.jpg',
                        'date': date,
                        'source': '투자센스TV',
                        'type': 'youtube',
                    })
                if len(videos) >= 12:
                    break
            if videos:
                break
    except Exception as e:
        print(f'파싱 오류: {e}')

    return videos

if __name__ == '__main__':
    videos = fetch()
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(videos, f, ensure_ascii=False, indent=2)
    print(f'저장 완료: {len(videos)}개')
    for v in videos[:3]:
        print(f"  {v['id']} | {v['title'][:40]} | {v['date']}")
