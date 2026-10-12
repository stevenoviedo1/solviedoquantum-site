/**
 * Shared games data used across Games page and Portfolio section
 */
export const games = [
  {
    id: 'grid-city',
    title: 'Grid City',
    status: 'Close to beta',
    description: 'A Godot life-sim and city game.',
    bullets: [
      'Life simulation meets city building',
      'Built with Godot engine',
      'Active development, approaching beta release',
    ],
    video: '/games/grid-city-trailer.mp4',
    poster: '/games/grid-city-poster.webp',
    tags: ['Godot', 'Life Sim', 'City Building', 'Beta'],
  },
  {
    id: 'football-universe',
    title: 'Football Universe',
    status: 'Beta coming soon',
    description: 'An American college football game.',
    bullets: [
      'Recruiting and depth chart management',
      'College football rankings and competition',
      'Beta launch planned',
    ],
    image: '/games/football-universe-screenshot.webp',
    tags: ['American Football', 'College Sports', 'Recruiting', 'Beta Soon'],
  },
  {
    id: 'pitch-nations',
    title: 'Pitch Nations',
    status: 'In development',
    description: 'A men\'s football management game with a world of 78,375 players across 3,135 clubs and 130 nations.',
    bullets: [
      'Every portrait, scene and crest is unique AI art',
      '78,375 players across 3,135 clubs',
      '130 nations represented',
    ],
    image: '/games/pitch-nations-screenshot.webp',
    imageSecondary: '/games/pitch-nations-table.webp',
    tags: ['Football', 'Management', 'AI Art', '78K+ Players'],
  },
];
