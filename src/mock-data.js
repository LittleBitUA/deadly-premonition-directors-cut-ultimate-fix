'use strict';
/**
 * mock-data.js — Static placeholder content for the dashboard.
 *
 * Real data sources will replace these later:
 *   - episodes/cases: from a localizable JSON of game chapters
 *   - news:           from a CMS / RSS feed
 *   - profile:        from save-file analysis
 *   - activity:       from internal launcher activity log
 *
 * Exposed on window.MOCK_DATA for use by renderer.js.
 */

window.MOCK_DATA = {

  // Rotating gameplay troubleshooting tips for the hero card (bilingual)
  quotes: [
    {
      lines_uk: [
        'Якщо гра вилітає в одному й тому самому місці, спробуйте скористатися внутрішньоігровими цигарками та промотати час. Іноді це допомагає обійти нестабільні події або скрипти.',
      ],
      lines_en: [
        'If the game keeps crashing in the same spot, try using the in-game cigarettes to pass time. This can sometimes help bypass unstable events or scripts.',
      ],
      author_uk: 'ВИПРАВЛЕННЯ ВИЛЬОТІВ',
      author_en: 'CRASH FIXES',
    },
    {
      lines_uk: [
        'Низький FPS чи мікрофризи?',
        'DXVK переводить гру',
        'на Vulkan — ставте через',
        'першозапуск.',
      ],
      lines_en: [
        'Low FPS or microstutter?',
        'DXVK reroutes the game',
        'through Vulkan — enable it',
        'via the first-run setup.',
      ],
      author_uk: 'ПРОДУКТИВНІСТЬ',
      author_en: 'PERFORMANCE',
    },
    {
      lines_uk: [
        'Втратили збереження?',
        'Лаунчер зберігає копії',
        'кожні 2 хвилини — Settings',
        '→ Saves → Backups.',
      ],
      lines_en: [
        'Lost a save?',
        'The launcher backs up every',
        '2 minutes — Settings →',
        'Saves → Backups.',
      ],
      author_uk: 'АВТОЗБЕРЕЖЕННЯ',
      author_en: 'AUTOSAVE',
    },
    {
      lines_uk: [
        'Розмиті текстури',
        'або погані тіні?',
        'Settings → Graphics —',
        'збільште Shadow / SSAO.',
      ],
      lines_en: [
        'Blurry textures or weak',
        'shadows? Settings → Graphics',
        '— raise Shadow Resolution',
        'and enable SSAO.',
      ],
      author_uk: 'ГРАФІКА',
      author_en: 'GRAPHICS',
    },
    {
      lines_uk: [
        'Гра не запускається? Спробуйте ввімкнути режим сумісності з Windows XP (Service Pack 3) на вкладці «Доступність».',
      ],
      lines_en: [
        'Game won’t launch? Try enabling Windows XP (Service Pack 3) compatibility mode in the Accessibility tab.',
      ],
      author_uk: 'СУМІСНІСТЬ',
      author_en: 'COMPATIBILITY',
    },
    {
      lines_uk: [
        'Чорний екран при запуску?',
        'Перевірте Display Mode у',
        'Settings → Graphics. Спершу',
        'Borderless, потім Fullscreen.',
      ],
      lines_en: [
        'Black screen on launch?',
        'Check Display Mode under',
        'Settings → Graphics. Try',
        'Borderless first, then Fullscreen.',
      ],
      author_uk: 'ДИСПЛЕЙ',
      author_en: 'DISPLAY',
    },
  ],

  // Episode / case file cards
  episodes: [
    { id: 1, code: '01', kind: 'New Case',      title: 'The Manhunt' },
    { id: 2, code: '02', kind: 'Investigation', title: 'The Witness' },
    { id: 3, code: '03', kind: 'Evidence',      title: 'A Peculiar Note' },
    { id: 4, code: '04', kind: 'Twilight',      title: 'A Fork in the Road' },
    { id: 5, code: '05', kind: 'Truth',         title: 'Coming Undone' },
    { id: 6, code: '06', kind: 'Revelation',    title: 'A Lonely Conclusion' },
  ],

  // News feed items
  news: [
    {
      title:   'Localization Update v1.0.3',
      excerpt: 'Full English localization and UI polish improvements.',
      date:    'May 10, 2025',
    },
    {
      title:   'Fan Patch Notes',
      excerpt: 'Stability fixes, visual tweaks, and quality of life improvements.',
      date:    'Apr 28, 2025',
    },
    {
      title:   'Community Spotlight',
      excerpt: 'Check out amazing screenshots from the community.',
      date:    'Apr 15, 2025',
    },
  ],

  // User profile / saves summary
  profile: {
    name:      'Francis York Morgan',
    role:      'Agent York',
    online:    true,
    casesDone: 22,
    casesAll:  48,
    playTime:  '18h 42m',
  },

  // Recent activity log
  activity: [
    { kind: 'completed',   text: 'Completed: "The Witness"',  date: 'May 11, 2025 · 8:47 PM' },
    { kind: 'collected',   text: 'Collected "Blue Pendant"',   date: 'May 11, 2025 · 6:03 PM' },
    { kind: 'episode',     text: 'Reached Episode 4',          date: 'May 10, 2025 · 9:47 PM' },
    { kind: 'screenshot',  text: 'Screenshot saved',           date: 'May 10, 2025 · 9:12 PM' },
  ],

  // Quick actions (callbacks wired in renderer.js)
  quickActions: [
    { id: 'check-updates',   label: 'Check for Updates',  icon: 'refresh' },
    { id: 'verify-files',    label: 'Verify Game Files',  icon: 'shield' },
    { id: 'open-save-dir',   label: 'Open Save Folder',   icon: 'folder' },
    { id: 'open-settings',   label: 'Game Settings',      icon: 'cog' },
    { id: 'explore-mods',    label: 'Explore Mods',       icon: 'puzzle' },
  ],

  // Update / localization progress (replaced with real data once update check runs)
  update: {
    available:    false,
    version:      'v1.0.0',
    releasedDate: '',
    downloading:  false,
    pct:          0,
    speed:        '',
    timeLeft:     '',
    sizeText:     '',
  },
};
