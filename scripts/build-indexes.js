#!/usr/bin/env node
/**
 * Gemeny Heritage — Build Indexes
 *
 * Scans data/ directories and generates index JSON files that list
 * all available people, families, and events with summary info.
 *
 * Run: node scripts/build-indexes.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const filePath = path.join(dir, f);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return data;
    });
}

function buildPeopleIndex(records) {
  return records.map(p => ({
    id: p.id,
    name: `${p.name.first}${p.name.middle ? ' ' + p.name.middle : ''} ${p.name.last}`,
    birth_year: p.birth && p.birth.date ? p.birth.date.substring(0, 4) : null,
    death_year: p.death && p.death.date ? p.death.date.substring(0, 4) : null,
    generation: p.generation || null,
    lineage_branch: p.lineage_branch || null,
    gender: p.gender || null,
    privacy: p.privacy || 'public'
  }));
}

function buildFamiliesIndex(records) {
  return records.map(f => ({
    id: f.id,
    partners: f.partners || [],
    marriage_year: f.marriage && f.marriage.date ? f.marriage.date.substring(0, 4) : null,
    children_count: f.children ? f.children.length : 0
  }));
}

function buildEventsIndex(records) {
  return records.map(e => ({
    id: e.id,
    title: e.title,
    date_start: e.date_start || null,
    era: e.era || null,
    category: e.category || null,
    people: e.people || []
  }));
}

// Build all indexes
const people = scanDirectory(path.join(DATA_DIR, 'people'));
const families = scanDirectory(path.join(DATA_DIR, 'families'));
const events = scanDirectory(path.join(DATA_DIR, 'events'));

const indexes = {
  'people-index.json': buildPeopleIndex(people),
  'families-index.json': buildFamiliesIndex(families),
  'events-index.json': buildEventsIndex(events)
};

for (const [filename, data] of Object.entries(indexes)) {
  const outPath = path.join(DATA_DIR, filename);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`  ${filename}: ${data.length} records`);
}

console.log('Done.');
