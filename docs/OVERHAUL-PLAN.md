# Portfolio Overhaul — Audit & Plan

## Verdict

The site is a set of impressive individual technical demos that collectively
fail as a portfolio. The craft is real; the information architecture is not.

**Measured:** 13.2 screens of scroll on desktop (1440x900), **19.9 on mobile**
(390x844). A portfolio should be 5-7. Nobody reaches Contact.

## Diagnosis — the five structural failures

### S1. The `#about` (Identity) section is a table of contents pretending to be content
Four cards — Builder, Researcher, Photographer, Candid — each a teaser with a
modal. Every one duplicates a full section that follows it:
Builder→`#work`, Researcher→`#research`, Photographer→`#photography`,
Candid→`#me`. It costs **1.67 screens desktop / 3.05 mobile** and adds no
information. Its Researcher card even restates the Research section's stats
with a *different* latency figure.

### S2. Projects are locked inside a game
`#work` is a three.js room. Project names are canvas textures on tiny virtual
monitors — illegible at render size. Reading one project description costs
3 interactions and ~2s of camera animation. **Desktop has no scannable project
list at all** (only mobile got the fallback grid). Projects are the single most
important content on a developer portfolio and they are the hardest thing to
read. The Man United neon sign is also the brightest object in the frame,
pulling the eye off the content — and it is a personal detail sitting in the
work section.

### S3. The hero communicates nothing concrete
Name + a word that rotates Developer/Researcher/Photographer/Builder every
2.5s + "I build things that work. I shoot things that stay." No role, no
institution, no specialism. A recruiter landing mid-cycle sees **"Photographer"**
in giant orange as the primary identity. "Builder" and "Developer" are the same
thing, padding the list to four. Content fills 440px of a 900px viewport — it
floats in a void. No resume link, no face, anywhere on the site.

### S4. A 2.5-second forced loading screen
`LoadingScreen.jsx` sets `body.overflow='hidden'` for 2500ms on first visit to
play a fake boot log ("brewing chai"). That is a hard 2.5s tax before anyone
sees anything.

### S5. Weight is allocated backwards
`#education` spends 944px (1.05 screens) on a degree plus **10th and 12th
standard percentages** — content no developer hiring manager reads. Research
(the strongest material) gets barely more. `#photography` distorts the photos
through a 3D dome projection instead of showing them.

## Execution defects found (40+)

**Voids / rhythm**
- Builder card: ~130px dead space under its last line
- "Off the clock" card: large hole (my previous compression left it hollow)
- Identity → marquee → section end: ~270px of stacked emptiness
- Research pipeline card: 310px tall for 92px of SVG content
- Every section opens with 160–230px of nothing before its eyebrow
- Experience/Education left columns: ~300px dead below the last element

**Contradictions**
- Latency stated 4 ways: `~0.9s` (strip), `sub-minute` (callout), `< 1 min`
  (stat card), `<1s` (Identity card)
- Photography subtitle says "Canada, Kerala, Kutch, Ahmedabad" but there are
  9 filter pills, 5 of them Canadian cities
- Footer nav lists 5 sections; main nav lists 8

**Repetition**
- IIT Bombay pipeline described in full in both `#research` and `#experience`
- Tech stack listed in Identity's marquee *and* the Skills cards
- Projects listed in the terminal header, the 3D monitors, and modals

**Craft**
- All three Leadership cards use the identical generic `Users` icon
- Leadership role lists: 4 roles with 3 identical date ranges, as separate rows
- Leadership card heights ragged (622 / 833 / 900+px in one row)
- Timeline rail dots misaligned with their cards in Experience and Education
- LogoLoop marquee renders desaturated grey while Skills shows the same logos
  in full brand colour
- Contact form is placeholder-only — no `<label>` elements (WCAG failure)
- 5 accent colours in play (purple, orange, green, pink, cyan)
- Three different eyebrow patterns: `■ LABEL`, `· LABEL ·`, `04 / LABEL`
- Header alignment mixed: left in most, centred in Identity/Photography
- "04 / WHAT DRIVES ME" — a fake section number on section 2 of 11

## The plan — 11 sections to 7

| # | New section | From | Action |
|---|---|---|---|
| 1 | **Hero** | Hero | Rewrite: concrete positioning, kill the rotating word, one primary CTA, resume link, tighten composition |
| — | ~~About~~ | Identity | **DELETE.** Marquee moves into Skills. Everything else is duplication |
| 2 | **Work** | DevStudio | Rebuild as a scannable 4-project grid, always visible. 3D room demoted to an opt-in reveal below it |
| 3 | **Research** | Research | Keep. Fix card void, reconcile latency to ONE number, drop redundant stat band |
| 4 | **Track record** | Experience + Education | Merge. Experience cards stay; education collapses to one line (degree + CGPA). Drop 10th/12th percentages |
| 5 | **Skills** | Skills | Keep new card design; absorb the marquee as a header band, in full colour |
| 6 | **Leadership** | Extracurriculars | Collapse role lists to one line each, give each org its own icon, fix ragged heights |
| 7 | **Photography** | Darkroom | Replace the dome with a real masonry grid + lightbox. 9 filters to 4. Drop viewfinder chrome |
| 8 | **The human** | CandidMe | Keep, tighten |
| 9 | **Contact** | Contact | Add real labels. Otherwise keep — it is the best-built section |
| — | **Footer** | Footer | Sync nav to actual sections, single identity line |

**Global:** cut LoadingScreen to ~600ms or remove; one eyebrow pattern; all
headers left-aligned; accents reduced to purple (dev) + orange (photo);
consistent section rhythm.

**Target: ~7 screens desktop, ~11 mobile.**

## Order of execution
1. Global: loading screen, tokens, eyebrow primitive
2. Hero rewrite
3. Delete Identity, relocate marquee
4. Work rebuild
5. Track record merge
6. Photography rebuild
7. Leadership, Research, Skills, Contact, Footer polish
8. Verify at 390 / 768 / 1440, rebuild, commit

---

# Results (measured, not estimated)

| Metric | Before | After |
|---|---|---|
| Desktop scroll (1440×900) | 13.2 screens | **11.2** |
| Mobile scroll (390×844) | 19.9 screens | **17.4** |
| Sections | 11 | **9** |
| Component lines | 9,655 | **6,759** |
| Files deleted | — | 10 (~2,900 lines) |
| `npm audit` | clean | clean |
| Horizontal overflow | none | none |
| Console errors | 0 | 0 |

## Target missed, honestly

The plan aimed for ~7 desktop screens. It landed at 11.2. Deleting `#about`
removed 1.7 screens, but the surviving sections are now *denser*, not shorter —
the Work grid shows four full project cards where the old section showed none
on desktop. Getting to 7 means cutting another section outright, and the two
remaining candidates (`#me`, `#photography`) are both content the site is
explicitly meant to show. 11.2 across 9 sections is ~1.24 screens each, which
is tight; the scroll is long because the content is real, not because of
padding. That is a different problem from the one this pass fixed.

## Left for the owner

1. **`repo` URLs in `lib/projects.js`** are all `null`. Every per-project
   "GitHub" button previously pointed at the profile root — misleading, so they
   were removed. Add real repository URLs and the buttons return automatically.
2. **No résumé link and no photograph of you anywhere on the site.** Both are
   standard and both are missing.
3. **`node_modules` is committed to this repository** (9,180 tracked files), so
   any dependency change produces a huge diff. Worth untracking.
4. The three.js studio and the Ctrl+` terminal are both preserved but now
   opt-in / hidden. If they are the point of the site, they should be promoted
   deliberately rather than by default.
