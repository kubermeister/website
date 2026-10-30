/**
 * The videos the landing page plays. They are rendered in the screencasts repository and copied here
 * into `public/videos/`, so GitHub Pages serves them as `video/mp4` with range requests: a GitHub
 * release asset is served as `application/octet-stream` with an attachment disposition, which iOS
 * Safari refuses to play. The release stays as the archive of each render; a CDN replaces this
 * folder when there is one, and only these paths change.
 */
export const VIDEOS = {
    /** The silent montage that loops in the hero: 49 s, no audio track. */
    hero: '/videos/kubermeister-hero.mp4',
    /** The same tour, narrated: 77 s. */
    overview: '/videos/kubermeister-overview.mp4',
    /** The first frame of the hero, shown until the video can play. */
    poster: '/videos/kubermeister-poster.jpg',
    overviewDuration: '1:17',
} as const;
