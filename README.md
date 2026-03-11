# Global Exchange & Startup System (MVP++)

## For beginners (LG laptop)
If you are not familiar with terminals, read this first:
- `START_HERE_CN.md` (Chinese, step-by-step for Windows/LG)

## Private-first local run (recommended)
This project may contain your personal profile, so run it locally first.

### macOS/Linux
```bash
./run_local.sh 8000
```

### Windows
```bat
run_local_windows.bat
```

Then open:
- http://127.0.0.1:8000/preview.html (recommended)
- http://127.0.0.1:8000/
- http://127.0.0.1:8000/preview/

## Features
- Global university list (incl. KU/PNU) for undergraduate / graduate / exchange tracks
- Exchange intelligence: timeline, procedure micro-steps, visa/language/finance/credit transfer logic
- Courses / professors / papers panel
- Korean + Chinese plan generation
- Local profile storage (`localStorage`)
- Startup MVP lab

## API
- `GET /api/courses?major=mechanical_engineering`
- `GET /api/professors`
- `GET /api/universities?track=undergraduate|graduate|exchange`
- `GET /api/plan?q=<keywords>`

## Public deploy (optional)
See `DEPLOY.md`.
Only deploy after removing personal/private data.
