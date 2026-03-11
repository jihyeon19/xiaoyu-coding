#!/usr/bin/env python3
import json
import os
import re
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.request import Request, urlopen
from urllib.error import URLError
from urllib.parse import urlparse, parse_qs

ROOT = Path(__file__).parent
SEED_PATH = ROOT / "data" / "ku_seed_data.json"

with open(SEED_PATH, "r", encoding="utf-8") as f:
    SEED = json.load(f)


def try_fetch_html(url: str) -> str:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req, timeout=8) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def extract_course_like_lines(html: str):
    html = re.sub(r"<script[\s\S]*?</script>", "", html, flags=re.I)
    html = re.sub(r"<style[\s\S]*?</style>", "", html, flags=re.I)
    text = re.sub(r"<[^>]+>", "\n", html)
    lines = [re.sub(r"\s+", " ", ln).strip() for ln in text.splitlines()]
    lines = [ln for ln in lines if len(ln) > 8]
    key = ("공학", "설계", "제어", "로봇", "mechan", "control", "design")
    return [ln for ln in lines if any(k.lower() in ln.lower() for k in key)][:40]


def build_plan_ko(user_input: str) -> str:
    return f"""[학업계획서 - 한국어]
1. 지원동기
저는 기계공학과 자유전공을 결합해 로보틱스 기반 창업을 실현하고자 합니다.
2. 학업 목표
- 핵심: 정역학/동역학/제어/메카트로닉스
- 융합: 프로그래밍, 데이터 분석, 기술사업화
3. 연차별 실행
- 1학년 기초, 2학년 MVP1, 3학년 연구실, 4학년 캡스톤+사업화
4. 국제전략
교환/대학원은 KU, PNU, MIT/CMU/ETH 등 목표별로 선택합니다.
5. 개인 배경
재도전 경험을 실행력으로 전환해 성과를 증명하겠습니다.
[입력 키워드]\n{user_input}
"""


def build_plan_zh(user_input: str) -> str:
    return f"""【学业计划书 - 中文】
一、动机：机械工程+自由专攻，围绕机器人创业。
二、目标：机械核心课+AI/数据+商业化能力。
三、路径：大一基础，大二MVP1，大三进实验室，大四毕业设计+创业。
四、国际：结合高丽大、釜山大学及全球名校交换/读研路线。
五、个人背景：把复读与家庭经历转化为执行力和韧性。
【输入关键词】\n{user_input}
"""


class Handler(SimpleHTTPRequestHandler):
    def _json(self, payload, code=200):
        b = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def _rewrite_spa_path(self):
        parsed = urlparse(self.path)
        if parsed.path in ("/preview", "/preview/"):
            self.path = "/index.html"
            return
        if "." not in parsed.path.split("/")[-1] and not parsed.path.startswith("/api/"):
            self.path = "/index.html"

    def do_HEAD(self):
        self._rewrite_spa_path()
        return super().do_HEAD()

    def do_GET(self):
        parsed = urlparse(self.path)
        query = parse_qs(parsed.query)

        if parsed.path == "/api/courses":
            major = query.get("major", ["mechanical_engineering"])[0]
            bundle = SEED["courses"].get(major, [])
            live_url = query.get("live_url", [""])[0]
            live_lines, err = [], None
            if live_url:
                try:
                    html = try_fetch_html(live_url)
                    live_lines = extract_course_like_lines(html)
                except URLError as e:
                    err = f"Live fetch blocked: {e}"
                except Exception as e:
                    err = f"Live fetch error: {e}"
            return self._json({"major": major, "seed_courses": bundle, "live_lines": live_lines, "live_error": err})

        if parsed.path == "/api/professors":
            return self._json({"professors": SEED["professors"], "sources": SEED["sources"]})

        if parsed.path == "/api/universities":
            track = query.get("track", [""])[0]
            country = query.get("country", [""])[0].lower()
            items = SEED.get("universities", [])
            if track:
                items = [u for u in items if track in u.get("tracks", [])]
            if country:
                items = [u for u in items if country in u.get("country", "").lower()]
            return self._json({"count": len(items), "universities": items})

        if parsed.path == "/api/plan":
            q = query.get("q", [""])[0]
            return self._json({"ko": build_plan_ko(q), "zh": build_plan_zh(q)})

        self._rewrite_spa_path()
        return super().do_GET()


if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"Serving on http://{host}:{port}")
    server.serve_forever()
