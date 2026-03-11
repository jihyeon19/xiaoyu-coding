# Otome Live Quest (Playable Web)

## Start

```bash
./scripts/start.sh
```

Open one of:

- http://localhost:4173
- http://127.0.0.1:4173

## Play loop

1. Fill environment form and generate quests.
2. Execute one step at a time (Done / Stuck / Skip).
3. Gain XP / Affinity, spend Energy, and progress Day.
4. Start a new day and continue.

## Implemented

- Otome-style UI.
- Tri-language switch (ko/zh/en).
- Persona voice flavor.
- Zero-Brain single-step gameplay loop.
- Daily state system (Day/XP/Energy/Affinity) with localStorage save.
- Notification permission prompt.
