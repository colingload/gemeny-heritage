# Migration Guide

Step-by-step plan for migrating content from gemeny.com and Ancestry.com into the new data structure.

## Phase 1: Parse the Descendants Database

The single biggest data migration task. The descendants list at `gemeny.com/archives/descendants.html` contains 60+ numbered entries across 7 generations with structured (but free-text) genealogical data.

### Approach

1. **Write a parser script** (`scripts/parse-descendants.js`) that reads the descendants HTML/text and extracts:
   - Person records → `data/people/{id}.json`
   - Family unit records → `data/families/{id}.json`
   - Timeline events (births, deaths, marriages, migrations) → `data/events/{id}.json`

2. **Manual review pass** — the parser won't catch everything perfectly. Review each generated JSON file for:
   - Correct date parsing (watch for Old Style dates like 1694/5)
   - Place name normalization
   - Proper ID assignment for people with duplicate names
   - Source citations carried forward

3. **Repeat for ancestors** — `ancestors.html` has the ascending Tewksbury/Copp/Gunne lines going back to 1500s England

### Known Data Quirks

- Generation numbering on the source uses bracket notation: `[1]`, `[2]`, etc. — these are footnote references, not generation numbers
- Some entries have `(?)` after dates indicating uncertainty
- Addresses/residence notes are mixed with footnotes at the bottom
- Lucy Pittman's pickle recipe is embedded mid-entry in Andrew Gemeny's record
- Some marriages listed as "unknown woman" — create placeholder records

## Phase 2: Import Ancestry.com GEDCOM

1. Export GEDCOM file from Ancestry.com
2. Run through `scripts/import-gedcom.js` converter
3. Merge with Phase 1 data, with gemeny.com data taking precedence for any conflicts (it has been hand-curated with source citations)
4. Flag any new people/relationships found only in Ancestry for manual review

## Phase 3: Content Migration

### Narratives
- [ ] Civil War memoir — transcribe full PDF into markdown (excerpt already started)
- [ ] Pleasant View / Quilt narrative — done (from clan.html)
- [ ] Thomas Gemini origin essay — done (from TGemini.htm)
- [ ] Oral history intro essay — done (from tapes.html)
- [ ] Family overview / landing page content — extract from index.html

### Recipes
- [ ] Lucy Pittman's Green Tomato Pickles — done

### Research
- [ ] Thomas Gemini origin — done
- [ ] Spelling change narrative (Gemini → Gemeny, attributed to Naomi Tewksbury)
- [ ] Sea Captain disappearance and cupboard legend

## Phase 4: Asset Collection

- [ ] Download all photos from gemeny.com (see assets/MANIFEST.md)
- [ ] Download audio files
- [ ] Download War.pdf
- [ ] Scan any additional physical artifacts Colin has access to
- [ ] Collect higher-resolution versions of photos if available from family

## Phase 5: Build the Site

### Core Pages
1. **Landing page** (`index.html`) — hero with family name, brief intro, navigation to tree/timeline
2. **Tree view** (`tree.html`) — interactive family tree, expandable branches
3. **Timeline view** (`timeline.html`) — scrollable by era/decade
4. **Person profile** (`person.html?id=...`) — dynamic page loaded from JSON
5. **Artifact viewer** — lightbox/modal for photos, audio player for recordings
6. **Stories index** — browsable list of narratives, oral histories, research
7. **About** — project credits, how to contribute

### JavaScript Modules
- `js/data-loader.js` — fetch and cache JSON data files
- `js/tree-renderer.js` — family tree visualization (SVG or canvas)
- `js/timeline-renderer.js` — horizontal/vertical timeline
- `js/person-page.js` — populate person profile from JSON
- `js/search.js` — search across people, events, narratives
- `js/audio-player.js` — custom player for oral history recordings

### CSS Architecture
- `css/base.css` — reset, typography, colors
- `css/layout.css` — grid, responsive breakpoints
- `css/tree.css` — tree view specific styles
- `css/timeline.css` — timeline specific styles
- `css/components.css` — cards, modals, player, nav

## Phase 6: Polish and Deploy

- Responsive testing (mobile-first)
- Performance optimization (lazy load images, preload critical data)
- Accessibility review
- Deploy to static hosting
- Set up custom domain (gemeny.com or subdomain)
- Share with family for feedback
