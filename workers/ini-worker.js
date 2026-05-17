'use strict';
/**
 * INI Worker Thread
 * ─────────────────
 * Runs in a separate thread via Node.js worker_threads.
 * Handles all blocking file I/O (read / write DPfix.ini) so the
 * main process event-loop is never stalled.
 *
 * Performance notes:
 *  • readFileSync / writeFileSync are acceptable here because this IS a
 *    worker thread — blocking is isolated from the main/renderer threads.
 *  • A new worker is instantiated once and reused for all subsequent
 *    operations (see main.js getWorker()).
 *  • Message IDs allow multiple concurrent callers without race conditions.
 */

const { parentPort } = require('worker_threads');
const fs   = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// Known keys (preserves save-order)
// ─────────────────────────────────────────────
const KEYS = [
  'renderWidth', 'renderHeight',
  'presentWidth', 'presentHeight',
  'aaQuality', 'aaType',
  'filteringOverride',
  'shadowMapScale', 'improveShadowPrecision',
  'reflectionScale',
  'improveDOF', 'addDOFBlur',
  'ssaoStrength', 'ssaoScale', 'ssaoType',
  'enableTextureDumping', 'enableTextureOverride',
  'forceWindowed', 'borderlessFullscreen', 'fullscreenHz',
  'screenshotDir', 'logLevel',
];

const DEFAULTS = {
  renderWidth:             '1920',
  renderHeight:            '1080',
  presentWidth:            '1920',
  presentHeight:           '1080',
  aaQuality:               '2',
  aaType:                  'SMAA',
  filteringOverride:       '0',
  shadowMapScale:          '1',
  improveShadowPrecision:  '0',
  reflectionScale:         '1',
  improveDOF:              '0',
  addDOFBlur:              '0',
  ssaoStrength:            '0',
  ssaoScale:               '1',
  ssaoType:                'VSSAO',
  enableTextureDumping:    '0',
  enableTextureOverride:   '0',
  forceWindowed:           '0',
  borderlessFullscreen:    '1',
  fullscreenHz:            '60',
  screenshotDir:           'dpfix\\screens',
  logLevel:                '0',
};

// ─────────────────────────────────────────────
// Message dispatcher
// ─────────────────────────────────────────────
parentPort.on('message', (msg) => {
  const { id, type } = msg;
  try {
    if (type === 'load') {
      parentPort.postMessage({ id, result: loadIni(msg.path) });
    } else if (type === 'save') {
      saveIni(msg.path, msg.lines, msg.values);
      parentPort.postMessage({ id, result: true });
    } else {
      parentPort.postMessage({ id, error: `Unknown task type: ${type}` });
    }
  } catch (err) {
    parentPort.postMessage({ id, error: err.message });
  }
});

// ─────────────────────────────────────────────
// Load
// ─────────────────────────────────────────────
function loadIni(filePath) {
  const raw   = fs.readFileSync(filePath, { encoding: 'utf-8' });
  // Normalise line endings: keep \n internally
  const lines = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  const values = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) continue;

    // Key is first whitespace-delimited token
    const match = trimmed.match(/^([A-Za-z][A-Za-z0-9_]*)\s+(.+)$/);
    if (match) {
      values[match[1]] = match[2].trim();
    }
  }

  // Fill missing keys with defaults
  for (const k of KEYS) {
    if (!(k in values) && k in DEFAULTS) {
      values[k] = DEFAULTS[k];
    }
  }

  return { lines, values, filePath };
}

// ─────────────────────────────────────────────
// Save
// ─────────────────────────────────────────────
function saveIni(filePath, lines, newValues) {
  // 1. Create .bak backup (best-effort)
  try {
    fs.copyFileSync(filePath, filePath + '.bak');
  } catch { /* ignore */ }

  // 2. Track which keys we have written via in-place replacement
  const pending = new Set(Object.keys(newValues));
  const outLines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Preserve comments and blank lines as-is
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) {
      outLines.push(line);
      continue;
    }

    const match = line.match(/^(\s*)([A-Za-z][A-Za-z0-9_]*)([\s\S]*)$/);
    if (match) {
      const [, ws, key] = match;
      if (key in newValues) {
        outLines.push(`${ws}${key} ${newValues[key]}`);
        pending.delete(key);
      } else {
        outLines.push(line);
      }
    } else {
      outLines.push(line);
    }
  }

  // 3. Append any keys that were not present in the original file,
  //    ordered by the canonical KEYS list.
  for (const key of KEYS) {
    if (pending.has(key)) {
      outLines.push(`${key} ${newValues[key]}`);
    }
  }

  // 4. Write atomically via temp file → rename
  const tmpPath = filePath + '.tmp';
  fs.writeFileSync(tmpPath, outLines.join('\n'), { encoding: 'utf-8' });
  fs.renameSync(tmpPath, filePath);
}
