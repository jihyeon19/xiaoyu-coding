# Otome Live Quest (Playable Web)

## Start

```bash
./scripts/start.sh
```

Open one of:

- http://localhost:4173
- http://127.0.0.1:4173

## Gemini API (Vercel)

Set env var in Vercel:

- `GEMINI_API_KEY`

Serverless endpoint:

- `POST /api/generate-draft`

## Features

- Playable day loop (Day / XP / Energy / Affinity)
- Quest generation and single-step flow
- User profile save + preview persistence
- "Generate Draft" powered by Gemini API
