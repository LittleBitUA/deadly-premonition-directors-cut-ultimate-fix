# Performance Analysis — DP1 Launcher

## Thread Model

```
┌─────────────────────────────────────────────────────────────────┐
│  RENDERER PROCESS  (Chromium / V8)                              │
│  • All UI rendering, event handling, DOM updates                │
│  • Lightweight IPC calls — never blocks                         │
└───────────────────┬─────────────────────────────────────────────┘
                    │ IPC (contextBridge / ipcMain)
┌───────────────────▼─────────────────────────────────────────────┐
│  MAIN PROCESS  (Node.js)                                        │
│  • Window lifecycle, dialog boxes, shell operations             │
│  • Spawns & manages the INI Worker thread                       │
│  • Game launch via child_process.spawn (detached, non-blocking) │
└───────────────────┬─────────────────────────────────────────────┘
                    │ worker_threads (MessageChannel)
┌───────────────────▼─────────────────────────────────────────────┐
│  INI WORKER THREAD  (Node.js Worker)                            │
│  • readFileSync  — parsing DPfix.ini                            │
│  • copyFileSync  — creating .bak backup before save             │
│  • writeFileSync — atomic temp→rename write                     │
│  Lifecycle: created once on app start, reused for all I/O       │
└─────────────────────────────────────────────────────────────────┘
```

## Why a Worker Thread for INI I/O?

| Concern | Without worker | With worker |
|---------|---------------|-------------|
| `readFileSync` on slow HDD | Blocks main event loop → UI jank | Isolated to worker thread |
| `copyFileSync` backup creation | Same | Same |
| `writeFileSync` | Same | Same |
| Concurrent requests | N/A | Safe — each message carries a unique ID |

DPfix.ini is typically < 2 KB, so in practice the blocking duration is
microseconds on modern SSDs. However:

1. **Correctness over necessity** — using a worker is always safe and
   prevents edge-cases on network drives or slow USB installs.
2. **Pattern** — the architecture scales trivially if heavier tasks
   (e.g., directory scanning for game detection, checksum validation,
   mod archive extraction) are added later.

## Heavy-Task Inventory

| Task | Thread | Notes |
|------|--------|-------|
| INI read + parse | **Worker** | Synchronous fs in isolated thread |
| INI backup (.bak) | **Worker** | `copyFileSync` before every save |
| INI write (atomic) | **Worker** | Temp file → rename |
| Game process launch | **Main** | `spawn(detached)` — returns immediately |
| File dialogs | **Main** | Native OS dialog, async |
| Settings JSON read/write | **Main** | <1 KB file, negligible |
| UI rendering / animations | **Renderer** | Pure CSS — GPU composited |

## Worker Lifecycle

- Created eagerly in `app.whenReady()` to pre-warm the thread.
- Reused for all subsequent load/save operations.
- Each message tagged with a unique `id` — multiple concurrent callers
  never mix up responses.
- Recreated automatically if it crashes (see `getWorker()` in main.js).

## Renderer Thread — Zero Blocking Guarantees

`renderer.js` contains **no synchronous file I/O**, **no CPU-intensive
loops**, and **no synchronous IPC calls**. All cross-process calls are
`await`-ed and return Promises, leaving the event loop free at all times.
