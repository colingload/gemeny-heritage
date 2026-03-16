# CLAUDE.md — Gemeny Family Heritage Project

## What This Project Is

A modern, interactive family heritage website for the Gemeny family — replacing and upgrading a static HTML site (gemeny.com) that has been maintained since the late 1990s by Steven Evans Gemeny. The project preserves nearly 300 years of family history spanning from Anthony Gemini's arrival in North America circa 1755 through the present day.

This is NOT just a family tree viewer. It's a time capsule — a way to browse family history by lineage OR by era, with rich artifacts (photos, documents, audio recordings, quilts, recipes, war memoirs) pinned to people and moments in time.

## Project Owner

Colin Gload (born Colin Frederick Gload, 24 May 1989). Colin appears in the genealogy as 7th generation, son of Amelia Gordon Gemeny and Frederick Anthony "Ted" Gload. His maternal line connects through William Gordon Gemeny → Andrew Gemeny → Edgar Dean Gemeny → Andrew Gemeny (Civil War era) → John Gemeny II → John "The Sea Captain" Gemeny → Anthony Gemini.

## Tech Stack

- **Frontend**: Plain HTML / CSS / JavaScript (no framework, no build step)
- **Data Layer**: JSON flat files + Markdown content files (git-tracked)
- **Hosting**: Static site (GitHub Pages, Netlify, or similar)
- **Design Goal**: Works on mobile, looks beautiful, feels like a curated museum — not a spreadsheet

## Architecture Overview

```
gemeny-heritage/
├── CLAUDE.md              ← You are here
├── README.md              ← Human-readable project overview
├── data/                  ← Structured JSON (the "database")
│   ├── people/            ← One JSON file per person
│   ├── families/          ← Family unit records (marriages, children)
│   └── events/            ← Timeline events (wars, migrations, milestones)
├── content/               ← Long-form Markdown content
│   ├── narratives/        ← Written stories, bios, memoirs
│   ├── research/          ← Origin research, genealogical notes
│   ├── oral-history/      ← Transcripts + metadata for audio recordings
│   └── recipes/           ← Family recipes (yes, these matter)
├── assets/                ← Media files
│   ├── photos/            ← Scanned photos, portraits, tin types
│   ├── documents/         ← Scanned certificates, deeds, military records
│   ├── audio/             ← MP3s of oral history recordings
│   └── artifacts/         ← Quilt photos, heirlooms, physical objects
├── site/                  ← The actual website
│   ├── index.html         ← Landing page
│   ├── css/               ← Stylesheets
│   ├── js/                ← JavaScript (tree renderer, timeline, search)
│   ├── pages/             ← HTML page templates
│   ├── components/        ← Reusable HTML partials (header, nav, cards)
│   └── templates/         ← Person page template, artifact viewer, etc.
└── scripts/               ← Build/migration utilities
    ├── import-gedcom.js   ← GEDCOM → JSON converter
    ├── validate-data.js   ← Schema validation for data/ files
    └── generate-pages.js  ← Optional: generate static HTML from data
```

## Data Model

### People (`data/people/{id}.json`)

Every person gets a unique ID. Format: `{first}-{last}-{birth_year}` or `{first}-{last}-{sequence}` when birth year is unknown.

```json
{
  "id": "benjamin-gemeny-1835",
  "name": {
    "first": "Benjamin",
    "middle": null,
    "last": "Gemeny",
    "maiden": null,
    "suffix": null,
    "alternate_spellings": []
  },
  "birth": {
    "date": "1835-05-04",
    "date_precision": "exact",
    "place": null
  },
  "death": {
    "date": null,
    "date_precision": null,
    "place": null
  },
  "gender": "male",
  "occupation": [],
  "residence": [
    { "date": "1855", "date_precision": "year", "place": "Baltimore, MD", "census_notes": null },
    { "date": "1861", "date_precision": "year", "place": "Kinsale, Westmoreland County, VA", "census_notes": null },
    { "date": "1870", "date_precision": "circa", "place": "Junction City, KS", "census_notes": null }
  ],
  "generation": 3,
  "lineage_branch": "gemeny-main",
  "parents": {
    "father": "john-gemeny-ii-1791",
    "mother": "matilda-figg-1796"
  },
  "privacy": "public",
  "tags": ["civil-war", "union-sympathizer", "prisoner-of-war"],
  "sources": [
    { "type": "family-bible", "note": "Gemeny Family Bible" },
    { "type": "vital-records", "note": "Baltimore MD marriage records" }
  ],
  "artifacts": ["photos/ben-gemeny-portrait.jpg"],
  "narratives": ["narratives/civil-war-memoir.md"],
  "notes": "Husband of Mary E. Roberts. Imprisoned as Union spy during Civil War. Subject of Mary's 1913 memoir."
}
```

### Families (`data/families/{id}.json`)

Links people into family units.

```json
{
  "id": "benjamin-gemeny-mary-roberts",
  "partners": ["benjamin-gemeny-1835", "mary-roberts-1836"],
  "marriage": {
    "date": "1855-11-01",
    "place": "Baltimore, MD"
  },
  "divorce": null,
  "children": [
    "henry-millard-gemeny-1856",
    "wilbur-gemeny-1858",
    "minnie-gemeny-1861",
    "bessy-gemeny"
  ]
}
```

### Events (`data/events/{id}.json`)

Timeline-browsable moments that connect to people and artifacts.

```json
{
  "id": "civil-war-imprisonment-1861",
  "title": "Benjamin Gemeny imprisoned as Union spy",
  "date_start": "1861",
  "date_end": "1863",
  "date_precision": "year",
  "era": "civil-war",
  "description": "Benjamin Gemeny, a Union sympathizer living in Confederate Virginia, was captured and imprisoned for nearly two years.",
  "people": ["benjamin-gemeny-1835", "mary-roberts-1836"],
  "location": "Westmoreland County, VA",
  "artifacts": [],
  "narratives": ["narratives/civil-war-memoir.md"],
  "tags": ["civil-war", "imprisonment", "kinsale"]
}
```

### Era Tags (for timeline browsing)

Use these standard era tags across events, people, and artifacts:

- `colonial` — pre-1776
- `early-republic` — 1776-1820
- `antebellum` — 1820-1860
- `civil-war` — 1861-1865
- `reconstruction` — 1865-1900
- `turn-of-century` — 1900-1920
- `interwar` — 1920-1940
- `wwii` — 1941-1945
- `postwar` — 1945-1970
- `modern` — 1970-2000
- `contemporary` — 2000-present

### Lineage Branches

The family traces back to a single common ancestor (Anthony Gemini → John "The Sea Captain" → John II), then branches through John II's nine children. Track branches as:

- `gemeny-main` — the trunk line from Anthony → John → John II
- `gemeny-john-iii` — John Gemeny 3rd branch
- `gemeny-richard-henry` — Richard Henry Gemeny branch
- `gemeny-andrew` — Andrew Gemeny (carpenter, Royal Oak) branch
- `gemeny-benjamin` — Benjamin Gemeny branch
- `gemeny-edgar-john` — Edgar John Gemeny branch
- `tewksbury` — maternal ancestor line (back to 1630s England)
- `copp-gunne` — deep maternal line (back to 1500s Warwickshire)
- `richards` — Katherine Richards line
- `figg` — Matilda Figg line
- `sanderson-burgess` — Mary Sanderson maternal line (Colin's grandmother)
- `gordon-mayhue` — Myrtelle Gordon line (Colin's great-grandmother, paternal-maternal)
- `arnold-bright` — Mary Jane Arnold / Samuel Arnold line
- `ellis` — Samuel H. Ellis line
- `mayes` — Mary Esther Mayes line (William W. Gordon's wife)
- `ferguson` — Eva Ferguson line (Edgar Dean Gemeny's wife)
- `gload` — Colin's paternal line
- `king-dougherty` — Donna King line (Steven's wife)

## Content Migration Notes

### From gemeny.com (source site)

The existing site at gemeny.com contains:

1. **Descendants list** (`archives/descendants.html`) — 7 generations, 60+ numbered entries with birth/death/marriage data. This is the primary genealogical data source. Needs to be parsed into individual `data/people/` and `data/families/` JSON files.

2. **Ancestors list** (`archives/ancestors.html`) — Traces back from John II through Tewksbury, Copp, Gunne lines to 1500s England. Same treatment.

3. **Civil War memoir** (`archives/short_war.html` + `archives/War.pdf`) — Mary Gemeny's 1913 account "A Reminiscence of the War of the Rebellion." The HTML has an excerpt; the PDF has the complete text. Should become `content/narratives/civil-war-memoir.md` with proper metadata frontmatter.

4. **Oral history recordings** (`tapes.html` + MP3 files) — Andrew Gemeny's recordings from 1974-1980, digitized by Steven Gemeny in 2007-2008. MP3s go to `assets/audio/`. Each tape gets a metadata file in `content/oral-history/`.

5. **Thomas Gemini research** (`TGemini.htm`) — W. Gordon Gemeny's 2002 essay on possible English/Belgian origin via Thomas Gemini of Louvain. Goes to `content/research/thomas-gemini-origin.md`.

6. **Family overview** (`archives/clan.html`) — History of John II, Pleasant View estate, the General Harrison Quilt, Gemley Corner. Rich narrative content for `content/narratives/`.

7. **Historical photos** — Ben & Mary portraits, Orin Ring tin types, Junction City group photo, quilt images. All go to `assets/photos/` or `assets/artifacts/`.

8. **Lucy Pittman's Green Tomato Pickles** — Embedded in the descendants page under Andrew Gemeny's second wife. Goes to `content/recipes/lucy-pittman-green-tomato-pickles.md`.

### From Ancestry.com

Colin has additional framework/data from Ancestry.com. GEDCOM export should be converted via `scripts/import-gedcom.js` and merged with the gemeny.com data, with the gemeny.com data taking precedence for sourced records.

## Navigation Model

The site supports TWO primary navigation modes from the same data:

### 1. Tree View
- Interactive family tree starting from any person
- Click to expand/collapse branches
- Each person node links to their full profile page
- Can start from Anthony Gemini (top) or navigate up from any descendant

### 2. Timeline View
- Horizontal or vertical scrollable timeline
- Organized by era/decade
- Shows events, births, deaths, migrations, artifacts
- Click any item to see the full story
- Filter by branch, by content type (photos, documents, stories)

### 3. Person Profile Page

Each person gets a rich profile page with three tabs (modeled after Ancestry.com's approach but with our own design):

**Facts Tab**
- Name, dates, places, occupation
- Family connections (parents, spouse, children)
- Source citations

**Gallery Tab**
- Photos, scanned documents, artifacts linked to this person
- Audio player for oral history recordings mentioning them

**LifeStory Tab** (the signature feature)
- Auto-generated chronological narrative timeline
- Assembles itself from the person's data + connected people's data
- Includes: birth, residences, marriage, births of children, deaths of parents/spouse/siblings, death
- Each event shows date, age at the time, narrative sentence, connected person card, location
- Life summary paragraph at top
- See `site/LIFESTORY-SPEC.md` for full generation algorithm and display spec

**Privacy**: Living people (no death date) default to "Private Living" in public view. Full LifeStory only visible in family/authenticated view.

### 4. Artifact Viewer
- Full-screen image viewer for photos and documents
- Audio player for oral history recordings
- Contextual metadata (who, when, where, story)

## Design Principles

1. **Museum, not spreadsheet** — the UI should feel like browsing a beautifully curated family museum, not a database query result
2. **Mobile first** — family members will browse this on their phones at gatherings
3. **Progressive disclosure** — show the essentials, let people drill deeper
4. **Source everything** — every fact should trace back to a source (bible, vital records, oral history, etc.)
5. **Living document** — the JSON/Markdown structure makes it easy for family members to contribute updates via git or a simple form

## Working Conventions

- All dates in ISO 8601 format (YYYY-MM-DD) where precision allows
- Use `date_precision` field: "exact", "month", "year", "circa", "unknown"
- Person IDs are kebab-case: `first-last-birthyear`
- File names match IDs: `benjamin-gemeny-1835.json`
- Markdown files use YAML frontmatter for metadata
- Photos named descriptively: `ben-gemeny-portrait-1880s.jpg`
- Commit messages should reference what content was added/updated

## Four-Branch Model

The site is centered on **W. Gordon Gemeny (1930-2017) & Mary Amelia Sanderson (1933-2016)** as the trunk, with four main branches traced back:

1. **gemeny** (39 people) — Gordon's paternal line. Anthony Gemini → Sea Captain → John Henry II → Andrew → Edgar Dean → Pop → Gordon. Deep English roots: Tewksbury, Copp/Gunne, Rogers, Brewse back to 1506.
2. **gordon-dubois** (30 people) — Gordon's maternal line. James Gordon (Ireland) → DuBois Huguenots (Louis Du Bois 1626, France → New Paltz NY). Van Kleek, Van Voorhees, Mayes.
3. **sanderson** (59 people) — Mary Amelia's paternal line. Joseph Sanderson (1720, NC) → through Duplin County → Georgia → DC. Kennedy (Irish), Williams lines.
4. **burgess** (35 people) — Mary Amelia's maternal line. Benjamin Burgess (1685, Port Tobacco MD) → Charles County → Alexandria → DC. Garrison, Howdershell, Recker/Schlichting.

All `lineage_branch` values in person records use these four keys (plus `gload` for modern descendants).

## Current Status

- [x] Project scaffold created
- [x] Data schemas defined
- [x] 165 person records with Ancestry timeline data
- [x] 7 family records, 5 events
- [x] Index page with editorial layout, animated migration map, scroll timeline
- [x] Interactive maps page (Americas, England, Burials) with playback
- [x] 4 story pages (Civil War memoir, Pleasant View, Thomas Gemini, Pickles)
- [x] Heritage page for Aurora & Brody
- [x] "This Day in History" widget
- [x] Four-branch filter system across data
- [ ] Person profile pages (individual HTML pages per person)
- [ ] Full family connection records
- [ ] More events for timeline
- [ ] Photo/document assets
- [ ] Deploy to hosting
