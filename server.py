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


def call_gemini(prompt: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is missing")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-1.5-flash:generateContent"
        f"?key={api_key}"
    )
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1200},
    }
    req = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(req, timeout=30) as resp:
        body = json.loads(resp.read().decode("utf-8", errors="ignore"))

    try:
        return body["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception:
        raise RuntimeError(f"Invalid Gemini response: {body}")


def build_generation_prompt(doc_type: str, keyword: str, language: str, profile: dict) -> str:
    name = profile.get("name", "지원자")
    nationality = profile.get("nationality", "")
    situation = profile.get("situation", "")
    target = profile.get("target", "")
    idea = profile.get("idea", "")

    if doc_type == "full":
        return (
            "You are an elite admissions + startup mentor.\n"
            "Write TWO complete documents with practical steps and measurable milestones.\n"
            "Output format:\n"
            "[KO]\n...\n\n[ZH]\n...\n"
            "Each version must include: 지원동기/动机, 학년별 계획, 교환/대학원 전략, 창업 MVP 로드맵,\n"
            "성과지표(KPI), 교수/연구실 접근 전략, 2026-2034 타임라인.\n"
            f"Profile: name={name}, nationality={nationality}, situation={situation}, target={target}, idea={idea}\n"
            f"Keywords: {keyword}"
        )

    target_lang = {"ko": "Korean", "zh": "Chinese", "en": "English"}.get(language, "Korean")
    doc_label = {"study": "study plan", "intro": "self introduction", "email": "professor outreach email"}.get(doc_type, "document")
    return (
        "You are an expert writer for university admissions and startup planning.\n"
        f"Write a high-quality {doc_label} in {target_lang}.\n"
        "Must be concrete, structured, and actionable.\n"
        "Include: goal, concrete steps, timeline, and next action in the coming 7 days.\n"
        f"Profile: name={name}, nationality={nationality}, situation={situation}, target={target}, idea={idea}\n"
        f"Keywords: {keyword}"
    )


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
            try:
                prompt = build_generation_prompt("full", q, "ko", {})
                text = call_gemini(prompt)
                ko = text
                zh = ""
                if "[KO]" in text and "[ZH]" in text:
                    ko = text.split("[KO]", 1)[1].split("[ZH]", 1)[0].strip()
                    zh = text.split("[ZH]", 1)[1].strip()
                return self._json({"ok": True, "ko": ko, "zh": zh})
            except Exception:
                return self._json({"ok": True, "ko": build_plan_ko(q), "zh": build_plan_zh(q), "fallback": True})

        self._rewrite_spa_path()
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/generate":
            self.send_error(404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8")) if length > 0 else {}
            doc_type = payload.get("docType", "study")
            keyword = payload.get("keyword", "")
            language = payload.get("language", "ko")
            profile = payload.get("profile", {})
            prompt = build_generation_prompt(doc_type, keyword, language, profile)
            text = call_gemini(prompt)

            if doc_type == "full":
                ko = text
                zh = ""
                if "[KO]" in text and "[ZH]" in text:
                    ko = text.split("[KO]", 1)[1].split("[ZH]", 1)[0].strip()
                    zh = text.split("[ZH]", 1)[1].strip()
                return self._json({"ok": True, "ko": ko, "zh": zh, "raw": text})

            return self._json({"ok": True, "text": text})
        except Exception as e:
            return self._json({"ok": False, "error": str(e)}, code=500)


if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8000"))
    try:
        server = ThreadingHTTPServer((host, port), Handler)
    except OSError as e:
        print(f"[ERROR] Failed to start server on http://{host}:{port}")
        print(f"[ERROR] {e}")
        print("Tip: the port may already be in use. Try another port, e.g. 8010.")
        raise SystemExit(1)

    print(f"Serving on http://{host}:{port}")
    print(f"Open: http://{host}:{port}/preview.html")
    server.serve_forever()
