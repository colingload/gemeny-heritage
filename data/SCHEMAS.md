# Data Schemas

This document defines the JSON schemas for all data files in the project. Every file in `data/` must conform to these schemas.

## Person Schema (`data/people/{id}.json`)

```json
{
  "$schema": "person",
  "id": "string (required) — kebab-case unique identifier, format: first-last-birthyear",
  "name": {
    "first": "string (required)",
    "middle": "string | null",
    "last": "string (required)",
    "maiden": "string | null — birth surname if changed by marriage",
    "suffix": "string | null — Jr., III, etc.",
    "alternate_spellings": ["array of strings — Gemini, Jeminy, Gemyne, etc."]
  },
  "birth": {
    "date": "string | null — ISO 8601 (YYYY-MM-DD, YYYY-MM, or YYYY)",
    "date_precision": "exact | month | year | circa | unknown",
    "place": "string | null — City, County, State format"
  },
  "death": {
    "date": "string | null",
    "date_precision": "exact | month | year | circa | unknown | null",
    "place": "string | null"
  },
  "burial": {
    "place": "string | null",
    "notes": "string | null"
  },
  "gender": "male | female",
  "occupation": ["array of strings"],
  "residence": [
    {
      "place": "string",
      "period": "string — freeform date range"
    }
  ],
  "generation": "integer — counted from John Gemeny II as generation 1",
  "lineage_branch": "string — branch identifier (see CLAUDE.md)",
  "tags": ["array of strings — era tags, thematic tags"],
  "sources": [
    {
      "type": "string — family-bible | vital-records | census | military | oral-history | newspaper | other",
      "note": "string — specific citation"
    }
  ],
  "artifacts": ["array of strings — relative paths to assets/"],
  "narratives": ["array of strings — relative paths to content/narratives/"],
  "notes": "string | null — freeform contextual notes"
}
```

## Family Schema (`data/families/{id}.json`)

```json
{
  "$schema": "family",
  "id": "string (required) — format: partner1-id--partner2-id",
  "partners": ["array of 2 person IDs"],
  "marriage": {
    "date": "string | null",
    "date_precision": "exact | month | year | circa | unknown | null",
    "place": "string | null"
  },
  "divorce": {
    "date": "string | null",
    "place": "string | null"
  },
  "children": ["array of person IDs — in birth order"],
  "notes": "string | null"
}
```

## Event Schema (`data/events/{id}.json`)

```json
{
  "$schema": "event",
  "id": "string (required) — kebab-case descriptive identifier",
  "title": "string (required) — display title",
  "date_start": "string — ISO 8601 date or year",
  "date_end": "string | null — for events spanning a period",
  "date_precision": "exact | month | year | circa",
  "era": "string — era tag from standard list",
  "category": "string — birth | death | marriage | migration | military | milestone | artifact | other",
  "description": "string — brief description for timeline display",
  "people": ["array of person IDs involved"],
  "location": "string | null",
  "artifacts": ["array of asset paths"],
  "narratives": ["array of content paths"],
  "tags": ["array of strings"]
}
```

## Content Frontmatter (Markdown files in `content/`)

All Markdown files use YAML frontmatter:

```yaml
---
title: "A Reminiscence of the War of the Rebellion"
author: "Mary Gemeny"
date_written: "1913-08-14"
date_precision: "exact"
people:
  - benjamin-gemeny-1835
  - mary-roberts-1836
era: "civil-war"
tags:
  - civil-war
  - imprisonment
  - kinsale
  - union-sympathizer
source: "Original manuscript, transcribed by Steven E. Gemeny, 1995"
copyright: "Copyright 1997 Steven E. Gemeny"
---
```

## Oral History Metadata (`content/oral-history/{id}.md`)

```yaml
---
title: "Andrew Gemeny Recollections — Tape 1 Side A"
speaker: "andrew-gemeny-1896"
recorded_by: "steven-gemeny-1955"
date_recorded: "1974"
date_precision: "circa"
date_digitized: "2008"
audio_file: "audio/tape-1-side-a-part-1.mp3"
duration_minutes: null
topics:
  - family-history
  - farm-life
  - brandywine-md
transcript_status: "not-started | in-progress | complete"
---
```

## Recipe Metadata (`content/recipes/{id}.md`)

```yaml
---
title: "Lucy Pittman's Green Tomato Pickles"
attributed_to: "lucy-pittman"
associated_people:
  - andrew-gemeny-1896
  - lucy-pittman
era: "postwar"
tags:
  - recipe
  - brandywine-md
  - pickles
---
```

## ID Conventions

- All IDs are lowercase kebab-case
- Person IDs: `{first}-{last}-{birth_year}` (e.g., `benjamin-gemeny-1835`)
- When birth year is unknown: `{first}-{last}-{sequence}` (e.g., `bessy-gemeny-1`)
- When names repeat across generations: include middle name or suffix (e.g., `john-gemeny-ii-1791`, `john-gemeny-3rd-1823`)
- Family IDs: `{partner1-id}--{partner2-id}` with double dash separator
- Event IDs: descriptive kebab-case (e.g., `anthony-gemini-arrives-salem-1755`)

## Date Handling

- Always ISO 8601 where possible: `YYYY-MM-DD`, `YYYY-MM`, `YYYY`
- Use `date_precision` to indicate confidence level
- For approximate dates: use the best estimate and set precision to `circa`
- For date ranges in residence/events: use `date_start` and `date_end`
- Historical dates before 1752 may use Old Style / New Style notation (e.g., `1694/5`)
