#!/usr/bin/env node
/**
 * Gemeny Heritage — GEDCOM to Tree JSON Parser
 *
 * Parses a GEDCOM 5.5.1 file and outputs a JSON file suitable for
 * the interactive family tree visualization.
 *
 * Run: node scripts/parse-gedcom-network.js "/path/to/file.ged"
 * Output: data/gedcom-tree.json
 */

const fs = require('fs');
const path = require('path');

const gedcomPath = process.argv[2];
if (!gedcomPath) {
  console.error('Usage: node parse-gedcom-network.js <path-to-gedcom-file>');
  process.exit(1);
}

if (!fs.existsSync(gedcomPath)) {
  console.error(`File not found: ${gedcomPath}`);
  process.exit(1);
}

// ── Parse GEDCOM ──────────────────────────────────────────────

const raw = fs.readFileSync(gedcomPath, 'utf8');
const lines = raw.split(/\r?\n/);

const individuals = {};  // keyed by XREF e.g. "I123"
const families = {};     // keyed by XREF e.g. "F55"
const notes = {};        // keyed by XREF e.g. "N1"

let currentRecord = null;
let currentType = null;   // 'INDI', 'FAM', 'NOTE'
let currentSubTag = null; // e.g. 'BIRT', 'DEAT', 'MARR', 'EVEN', '_MILT', 'IMMI', 'EMIG', 'BAPM'
let currentEvenType = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const level = parseInt(line[0], 10);
  const rest = line.substring(2);

  // Level 0 — new record
  if (level === 0) {
    currentSubTag = null;
    currentEvenType = null;

    const xrefMatch = rest.match(/^@(\w+)@\s+(\w+)/);
    if (xrefMatch) {
      const xref = xrefMatch[1];
      const tag = xrefMatch[2];

      if (tag === 'INDI') {
        currentType = 'INDI';
        currentRecord = {
          id: xref, name: '', sex: '',
          birthDate: null, birthPlace: null,
          deathDate: null, deathPlace: null,
          badges: [],
          familiesAsSpouse: [],
          familyAsChild: null
        };
        individuals[xref] = currentRecord;
      } else if (tag === 'FAM') {
        currentType = 'FAM';
        currentRecord = {
          id: xref, husband: null, wife: null,
          children: [],
          marriageDate: null, marriagePlace: null
        };
        families[xref] = currentRecord;
      } else if (tag === 'NOTE') {
        currentType = 'NOTE';
        const noteText = rest.substring(xref.length + 2 + tag.length).trim();
        currentRecord = { id: xref, text: noteText };
        notes[xref] = currentRecord;
      } else {
        currentType = null;
        currentRecord = null;
      }
    } else {
      currentType = null;
      currentRecord = null;
    }
    continue;
  }

  if (!currentRecord) continue;

  // ── INDI records ──────────────────────────────────────────

  if (currentType === 'INDI') {
    if (level === 1) {
      currentSubTag = null;
      currentEvenType = null;

      const tagMatch = rest.match(/^(\S+)\s*(.*)/);
      if (!tagMatch) continue;
      const tag = tagMatch[1];
      const value = tagMatch[2] || '';

      if (tag === 'NAME') {
        // GEDCOM name format: "First Middle /Last/"
        currentRecord.name = value.replace(/\//g, '').trim();
      } else if (tag === 'SEX') {
        currentRecord.sex = value;
      } else if (tag === 'BIRT') {
        currentSubTag = 'BIRT';
      } else if (tag === 'DEAT') {
        currentSubTag = 'DEAT';
      } else if (tag === 'FAMS') {
        const fRef = value.replace(/@/g, '');
        currentRecord.familiesAsSpouse.push(fRef);
      } else if (tag === 'FAMC') {
        currentRecord.familyAsChild = value.replace(/@/g, '');
      } else if (tag === '_MILT') {
        if (!currentRecord.badges.includes('military')) {
          currentRecord.badges.push('military');
        }
        currentSubTag = '_MILT';
      } else if (tag === 'IMMI' || tag === 'EMIG') {
        if (!currentRecord.badges.includes('immigration')) {
          currentRecord.badges.push('immigration');
        }
        currentSubTag = tag;
      } else if (tag === 'EVEN') {
        currentSubTag = 'EVEN';
        currentEvenType = null;
      } else if (tag === 'NOTE') {
        const noteRef = value.replace(/@/g, '');
        if (noteRef && notes[noteRef] && /DAR/i.test(notes[noteRef].text)) {
          if (!currentRecord.badges.includes('dar')) {
            currentRecord.badges.push('dar');
          }
        }
        // We'll also check inline note text later
        currentSubTag = 'NOTE_INLINE';
      } else if (tag === 'BAPM') {
        currentSubTag = 'BAPM';
      }
    } else if (level === 2) {
      const tagMatch = rest.match(/^(\S+)\s*(.*)/);
      if (!tagMatch) continue;
      const tag = tagMatch[1];
      const value = tagMatch[2] || '';

      if (currentSubTag === 'BIRT') {
        if (tag === 'DATE') currentRecord.birthDate = value;
        if (tag === 'PLAC') currentRecord.birthPlace = value;
      } else if (currentSubTag === 'DEAT') {
        if (tag === 'DATE') currentRecord.deathDate = value;
        if (tag === 'PLAC') currentRecord.deathPlace = value;
      } else if (currentSubTag === 'EVEN') {
        if (tag === 'TYPE') {
          currentEvenType = value;
          // Check for masonic event types (exclude "Applied" which means rejected)
          if (/raised.*mason|worshipful|york rite|commandr|senior warden|junior warden|junior deacon|deputy grand|grand lodge/i.test(value)) {
            if (!currentRecord.badges.includes('freemason')) {
              currentRecord.badges.push('freemason');
            }
          }
          // Check for arrival/departure (immigration)
          if (/arrival|departure/i.test(value)) {
            if (!currentRecord.badges.includes('immigration')) {
              currentRecord.badges.push('immigration');
            }
          }
        }
      }
    }
  }

  // ── FAM records ──────────────────────────────────────────

  if (currentType === 'FAM') {
    if (level === 1) {
      currentSubTag = null;
      const tagMatch = rest.match(/^(\S+)\s*(.*)/);
      if (!tagMatch) continue;
      const tag = tagMatch[1];
      const value = tagMatch[2] || '';

      if (tag === 'HUSB') {
        currentRecord.husband = value.replace(/@/g, '');
      } else if (tag === 'WIFE') {
        currentRecord.wife = value.replace(/@/g, '');
      } else if (tag === 'CHIL') {
        currentRecord.children.push(value.replace(/@/g, ''));
      } else if (tag === 'MARR') {
        currentSubTag = 'MARR';
      }
    } else if (level === 2 && currentSubTag === 'MARR') {
      const tagMatch = rest.match(/^(\S+)\s*(.*)/);
      if (!tagMatch) continue;
      const tag = tagMatch[1];
      const value = tagMatch[2] || '';

      if (tag === 'DATE') currentRecord.marriageDate = value;
      if (tag === 'PLAC') currentRecord.marriagePlace = value;
    }
  }

  // ── NOTE records (top-level, referenced by INDI) ─────────

  if (currentType === 'NOTE') {
    if (level === 1) {
      const tagMatch = rest.match(/^(\S+)\s*(.*)/);
      if (tagMatch) {
        const tag = tagMatch[1];
        const value = tagMatch[2] || '';
        if (tag === 'CONC' || tag === 'CONT') {
          currentRecord.text += (tag === 'CONT' ? '\n' : '') + value;
        }
      }
    }
  }
}

// ── Build masonic media lookup ──────────────────────────────
// Scan OBJE records at end of file for masonic-related media
const masonicMedia = new Set();  // set of OBJE XREFs with masonic content
const patriotMedia = new Set();  // set of OBJE XREFs with DAR/SAR/patriot content

const rawLines = raw.split(/\r?\n/);
let currentObje = null;
for (let i = 0; i < rawLines.length; i++) {
  const line = rawLines[i].trim();
  if (!line) continue;
  const level = parseInt(line[0], 10);
  if (level === 0) {
    const m = line.match(/^0 @(\w+)@ OBJE/);
    currentObje = m ? m[1] : null;
    continue;
  }
  if (currentObje) {
    // Only match actual masonic RECORDS, not generic SquareCompass icons
    // (Steve used SquareCompass.jpg as decorative icons on many people)
    if (/masonic record|eastern star|lodge.*record/i.test(line)) {
      masonicMedia.add(currentObje);
    }
    if (/patriot|revolutionary.*ancestor|DAR Library|SAR Membership|Sons of the American Revolution/i.test(line)) {
      patriotMedia.add(currentObje);
    }
  }
}

// ── Second pass: comprehensive badge detection ──────────────
// Re-scan the entire file for:
// 1. SAR Membership references in SOUR/PAGE fields
// 2. DAR references in NOTEs (now that all notes are parsed)
// 3. Masonic references via OBJE media cross-references
// 4. Eastern Star references

let currentIndi = null;
for (let i = 0; i < rawLines.length; i++) {
  const line = rawLines[i].trim();
  if (!line) continue;
  const level = parseInt(line[0], 10);

  if (level === 0) {
    const m = line.match(/^0 @(\w+)@ INDI/);
    currentIndi = m ? m[1] : null;
    continue;
  }

  if (!currentIndi || !individuals[currentIndi]) continue;
  const indi = individuals[currentIndi];

  // Check for SAR/DAR membership in source PAGE citations and text
  if (/SAR Membership|Sons of the American Revolution/i.test(line)) {
    if (!indi.badges.includes('dar')) {
      indi.badges.push('dar');
    }
  }

  // Check for DAR in any text field
  if (/DAR Patriot|DAR #|DAR Library|Daughters of the American Revolution/i.test(line)) {
    if (!indi.badges.includes('dar')) {
      indi.badges.push('dar');
    }
  }

  // Check for Revolutionary War service indicators
  if (/New York in the Revolution|Revolutionary Ancestor|revolutionary war|continental army|continental congress/i.test(line)) {
    if (!indi.badges.includes('dar')) {
      indi.badges.push('dar');
    }
  }

  // Check for Revolutionary War pensioners (Acts of 1818 = Rev War pensions)
  if (/Pensioners Under Acts of 1818|1841 Pensioners List/i.test(line)) {
    if (!indi.badges.includes('dar')) {
      indi.badges.push('dar');
    }
  }

  // Check for "(revolution)" in names or text
  if (/\(revolution\)|colonial militia/i.test(line)) {
    if (!indi.badges.includes('dar')) {
      indi.badges.push('dar');
    }
  }

  // Check NOTE references for DAR/SAR/Patriot (now that all notes are parsed)
  if (level === 1) {
    const noteMatch = line.match(/^1 NOTE @(\w+)@/);
    if (noteMatch && notes[noteMatch[1]]) {
      const noteText = notes[noteMatch[1]].text;
      if (/DAR|SAR|Patriot|FIRST LIEUTENANT|Regiment|Militia/i.test(noteText)) {
        if (!indi.badges.includes('dar')) {
          indi.badges.push('dar');
        }
      }
    }
  }

  // Check OBJE references for masonic and patriot media
  if (level === 1) {
    const objeMatch = line.match(/^1 (?:OBJE|_PHOTO) @(\w+)@/);
    if (objeMatch) {
      const mediaId = objeMatch[1];
      if (masonicMedia.has(mediaId) && !indi.badges.includes('freemason')) {
        indi.badges.push('freemason');
      }
      if (patriotMedia.has(mediaId) && !indi.badges.includes('dar')) {
        indi.badges.push('dar');
      }
    }
  }
}

// ── Cross-reference with site data ──────────────────────────

const DATA_DIR = path.join(__dirname, '..', 'data');
const indexPath = path.join(DATA_DIR, 'people-index.json');
let siteIndex = [];
if (fs.existsSync(indexPath)) {
  siteIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
}

// Build lookup: normalize name+birthYear for matching
function normalizeName(name) {
  return name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractYear(dateStr) {
  if (!dateStr) return null;
  const m = dateStr.match(/\d{4}/);
  return m ? parseInt(m[0], 10) : null;
}

const siteLookup = {};
for (const sp of siteIndex) {
  const key = normalizeName(sp.name) + '|' + (sp.birth_year || '');
  siteLookup[key] = sp;
}

// Match GEDCOM individuals to site records
for (const id of Object.keys(individuals)) {
  const indi = individuals[id];
  const year = extractYear(indi.birthDate);
  const key = normalizeName(indi.name) + '|' + (year || '');
  const match = siteLookup[key];
  if (match) {
    indi.siteId = match.id;
    indi.branch = match.lineage_branch;
    indi.generation = match.generation;
  } else {
    indi.siteId = null;
    indi.branch = null;
    indi.generation = null;
  }
  indi.birthYear = year;
}

// ── Build output ────────────────────────────────────────────

const nodes = Object.values(individuals).map(indi => ({
  id: indi.id,
  name: indi.name,
  sex: indi.sex,
  birthYear: indi.birthYear,
  birthDate: indi.birthDate,
  birthPlace: indi.birthPlace,
  deathDate: indi.deathDate,
  deathPlace: indi.deathPlace,
  siteId: indi.siteId,
  branch: indi.branch,
  generation: indi.generation,
  badges: indi.badges,
  familiesAsSpouse: indi.familiesAsSpouse,
  familyAsChild: indi.familyAsChild
}));

const fams = Object.values(families).map(f => ({
  id: f.id,
  husband: f.husband,
  wife: f.wife,
  children: f.children,
  marriageDate: f.marriageDate,
  marriagePlace: f.marriagePlace
}));

const output = { nodes, families: fams };

const outPath = path.join(DATA_DIR, 'gedcom-tree.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

// ── Summary ─────────────────────────────────────────────────

const badgeCounts = {};
for (const n of nodes) {
  for (const b of n.badges) {
    badgeCounts[b] = (badgeCounts[b] || 0) + 1;
  }
}
const matched = nodes.filter(n => n.siteId).length;

console.log(`Parsed ${nodes.length} individuals, ${fams.length} families`);
console.log(`Matched ${matched} to existing site records`);
console.log('Badges:', badgeCounts);
console.log(`Output: ${outPath}`);
