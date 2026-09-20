# Live-site verification prompt

Reusable prompt for checking that the deployed site actually works, not
just that the local build works. Paste the block below whenever a deploy
needs to be verified. The point of this prompt is to define what counts
as a FAIL before looking at anything, so the check can't be talked into
a pass.

---

Verify the live site, not localhost. For each item below, the check
FAILS if its listed condition is true. Absence of a failure condition is
what counts as a pass — not "the page looked fine."

## Homepage — https://lucashoke.com

FAILS if any of:
- HTTP status is not 200, or `curl` returns a Cloudflare/GitHub error
  page instead of the real HTML
- Response `<title>` is not "Home · Lucas Hoke"
- `/assets/js/wave-background.js` is missing from the response body
  (script silently 404ing would not fail the page load, so this must be
  checked in the fetch, not inferred from the page rendering)
- The screenshot's canvas is static/blank rather than showing the
  animated wave pattern
- Nav links (Home / Blog / Resume), the avatar image, and the intro text
  are not all visible in the screenshot
- The browser's URL bar does not show `lucashoke.com` (a localhost or
  file:// screenshot is an automatic fail regardless of what renders)
- `cache-control`/`cf-cache-status` headers indicate a cached response
  older than the latest deploy (stale CDN cache after publish)

## Resume link — https://lucashoke.com/assets/resume.pdf

FAILS if any of:
- HTTP status is not 200
- `content-type` is not `application/pdf`
- The fetched file is not a valid PDF (`file` reports something other
  than "PDF document")
- The browser screenshot does not show a rendered PDF with
  `lucashoke.com/assets/resume.pdf` in the URL bar

## Blog — https://lucashoke.com/blog/ and first post

FAILS if any of:
- `/blog/` does not return 200 or contains no `/blog/<slug>/` links
- The first post URL derived from `/blog/` returns anything other than
  200 (this catches a broken `_layouts/post.html` or a post excluded
  from the Jekyll build even though the index still lists it)
- Response `<title>` does not match the post title shown in the index
- The screenshot does not show the post title, date, and body text with
  the post's URL visible in the address bar

## General failure conditions (apply to every check above)

- Any screenshot taken from a local dev server, a `file://` path, or a
  tab that was already open before this verification run
- Any fetch or screenshot reused from a previous verification instead of
  taken fresh in this session
- A README "what would have made this fail" line that is generic enough
  to apply to any site (e.g. "if the site was broken") instead of naming
  the specific mechanism (missing file, stale cache, broken layout, bad
  asset path)

---

If every check above passes, rebuild `verification/` at the repo root:

verification/
  README.md
  home-screenshot.png + home-fetch.txt
  resume-screenshot.png + resume-fetch.txt
  blog-first-post-screenshot.png + blog-first-post-fetch.txt

`README.md` must contain:
- URL checked: https://lucashoke.com
- When: <YYYY-MM-DD HH:MM, local time of the check>
- Checks performed: one line per check above, naming its screenshot/fetch
  pair
- What would have made this fail: the specific FAIL condition(s) from
  above that were closest to being true, or that are most likely to
  regress next deploy — not a restatement of "it works."
