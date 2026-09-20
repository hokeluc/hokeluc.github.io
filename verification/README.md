URL checked: https://lucashoke.com
When: 2026-09-20 14:57 (local time)

Checks performed:
- home-screenshot.png / home-fetch.txt — homepage returns 200, title is
  "Home · Lucas Hoke", assets/js/wave-background.js is present in the
  fetched body, canvas checksum sampled twice (2s apart) changed from
  232731 to 171225 confirming live animation, and nav (Home/Blog/Resume),
  avatar, and intro text all appear in the browser snapshot at
  lucashoke.com
- resume-screenshot.png / resume-fetch.txt — /assets/resume.pdf returns
  200 with content-type application/pdf, `file` confirms "PDF document,
  version 1.5", and the browser shows the rendered PDF with
  lucashoke.com/assets/resume.pdf in the URL bar
- blog-first-post-screenshot.png / blog-first-post-fetch.txt — /blog/
  returns 200 and lists one post link (/blog/first-post/) with link text
  "First post"; /blog/first-post/ returns 200 with title
  "First post · Lucas Hoke" matching the index; the browser snapshot
  shows the post heading, date (September 3, 2026), and body text at
  lucashoke.com/blog/first-post/

What would have made this fail:
- If the canvas checksum had stayed identical across the two samples,
  that would mean the wave animation stalled (e.g. a JS error halting
  the requestAnimationFrame loop) while the canvas still rendered a
  single static frame — this is the specific mechanism the repeated
  checksum sample was built to catch, since a screenshot alone can't
  distinguish a frozen canvas from a moving one.
- If assets/js/wave-background.js were missing from the fetched HTML
  body (a silent 404 on the script tag), the homepage would still
  render fully — nav, avatar, and text are server-rendered — so this
  would only show up in the fetch, not in a screenshot, which is why it
  was checked directly against home-body.html rather than inferred from
  the browser view.
- If Cloudflare served a cached copy older than this deploy, cache-control
  would show a long max-age with cf-cache-status: HIT instead of the
  DYNAMIC status actually seen; this is the most likely thing to regress
  on the next deploy if cache purging isn't automatic.
- If /blog/ listed first-post but _layouts/post.html or the post's front
  matter were broken, /blog/first-post/ would 404 or serve a title that
  didn't match the index link text — both were checked directly rather
  than assumed from the index page alone.
