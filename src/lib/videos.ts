/**
 * The videos the landing page plays, by URL: they are rendered in the screencasts repository and
 * attached to a release there, never committed here (a re-render would add megabytes of history
 * each time). A new render is a new release and a new tag below; nothing else changes.
 */
const RELEASE = 'https://github.com/kubermeister/screencasts/releases/download/videos-2026-10-29';

export const VIDEOS = {
    /** The silent montage that loops in the hero: 49 s, no audio track. */
    hero: `${RELEASE}/kubermeister-hero.mp4`,
    /** The same tour, narrated: 77 s. */
    overview: `${RELEASE}/kubermeister-overview.mp4`,
    /** The first frame of the hero, shown until the video can play. */
    poster: `${RELEASE}/kubermeister-poster.jpg`,
    overviewDuration: '1:17',
} as const;
