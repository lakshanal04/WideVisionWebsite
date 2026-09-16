# WideVision VFX Studio

A lightweight, responsive static website. No build step, framework, or runtime dependencies.

## Local development

Run `python3 -m http.server 8080` from this directory and open `http://localhost:8080`.
Run `python3 scripts/check_site.py` to validate local links, asset references, document landmarks, and navigation states.

## Structure

- `index.html`: canonical homepage.
- `main.html`: compatibility redirect for existing links.
- `services.html`, `about.html`, `contact.html`: studio pages.
- `style.css`: shared design tokens, components, responsive layouts, and motion.
- `script.js`: navigation, reveal effects, and background video controls.

Keep primary navigation and footer markup consistent across the four pages. Content is server-readable HTML and remains accessible without JavaScript. The original logo, brand colors, founding year, and section order are preserved. Do not add unverified contact details, client names, or credits.

## Visual and motion specifications

| Element | Parameters |
| --- | --- |
| Brand | Blue `#0e1bcd`, green `#0dcd38`, paper `#fcfdfa` |
| Dark surfaces | Ink `#070d1c`; fine white borders at 9–15% opacity |
| Card surfaces | 20px radius; `0 2px 4px #0a143205, 0 16px 40px -20px #0a143238` |
| Scrolled header | 90% dark background; `blur(20px) saturate(140%)`; 260ms transition |
| UI easing | `cubic-bezier(.2,.8,.2,1)` |
| Button hover | `translateY(-2px)` over 180ms; brighter surface and expanded shadow |
| Button press | `translateY(0) scale(.98)`; inset shadow |
| Keyboard focus | 3px green outline, 6px offset; never remove focus indication |
| Service link hover | Arrow rotates 45 degrees over 240ms; circle becomes green |
| Reveals | Opacity 0→1 and `translateY(20px)`→0, 700ms, `cubic-bezier(.16,1,.3,1)` |
| Stagger | 70ms between desktop card siblings, capped at 210ms |
| Reduced motion | No smooth scrolling or reveals; background video starts paused |

Informational cards deliberately do not pretend to be clickable. Mobile navigation supports Escape, outside click, focus leaving the header, and breakpoint changes. Background video has an explicit pause control and pauses when the tab is hidden.

## Media and hosting

Serve the repository root on a static host; `index.html` is the entrypoint. Relative URLs also support GitHub Pages project paths. The historical `main.html` URL redirects to the homepage.

`aboutvideo.mp4` is a Git LFS asset; the current checkout contains only its pointer. The About page therefore uses a lightweight branded composition without requesting that file. The original asset remains in the repository. `stockvideo.mp4` provides decorative homepage ambience, not a studio showreel. Consider a compressed, approved studio reel for a future replacement.

Contact information was not supplied, so there is no fake contact form, email address, or submission confirmation. English, French, and Korean describe studio languages; this release does not provide translated pages.

## Manual QA

Check each page at desktop and 390px mobile widths, keyboard navigation, menu dismissal, video play/pause, all links, reduced motion, and JavaScript-disabled rendering. Verify no horizontal overflow or console errors.
