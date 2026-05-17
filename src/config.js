'use strict';
/**
 * config.js — shared UI constants (renderer-side)
 * Loaded before renderer.js via <script> tags.
 */

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

// Shadow & reflection scale have non-linear numeric values (1 → ×1, 2 → ×4, 4 → ×8)
const SHADOW_SCALE_OPTIONS = [
  { value: '1', label: '1× — стандартні тіні' },
  { value: '2', label: '4× — чіткіші тіні' },
  { value: '4', label: '8× — дуже чіткі тіні' },
];

const REFLECT_SCALE_OPTIONS = [
  { value: '1', label: '1× — стандарт' },
  { value: '2', label: '4×' },
  { value: '4', label: '8×' },
];

const DOF_BLUR_OPTIONS = [
  { value: '0', label: 'Вимкнено' },
  { value: '1', label: 'Для 1080p' },
  { value: '2', label: 'Для 4K' },
];

const RESOLUTION_PRESETS = [
  '1280×720',
  '1366×768',
  '1600×900',
  '1920×1080',
  '2560×1440',
  '3840×2160',
  '5120×2880',
];
