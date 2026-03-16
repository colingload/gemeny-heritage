/**
 * Gemeny Heritage — Data Loader
 *
 * Fetches and caches JSON data files for people, families, and events.
 * All data lives as flat JSON files — no database, no build step.
 *
 * Usage:
 *   const loader = new DataLoader('../data');
 *   await loader.loadIndexes();
 *   const person = await loader.getPerson('benjamin-gemeny-1835');
 *   const allPeople = await loader.getAllPeople();
 *   const events = await loader.getEventsByEra('civil-war');
 */

class DataLoader {
  constructor(basePath = '../data') {
    this.basePath = basePath;
    this.cache = {
      people: {},
      families: {},
      events: {}
    };
    this.indexes = {
      people: null,
      families: null,
      events: null
    };
    this._indexPromise = null;
  }

  async fetchJSON(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      return await response.json();
    } catch (err) {
      console.error(`DataLoader error: ${err.message}`);
      return null;
    }
  }

  /** Load all three index files. Call once at app startup. */
  async loadIndexes() {
    if (this._indexPromise) return this._indexPromise;
    this._indexPromise = Promise.all([
      this.fetchJSON(`${this.basePath}/people-index.json`),
      this.fetchJSON(`${this.basePath}/families-index.json`),
      this.fetchJSON(`${this.basePath}/events-index.json`)
    ]).then(([people, families, events]) => {
      this.indexes.people = people || [];
      this.indexes.families = families || [];
      this.indexes.events = events || [];
    });
    return this._indexPromise;
  }

  /** Get a single person by ID (fetches full record, caches it). */
  async getPerson(id) {
    if (this.cache.people[id]) return this.cache.people[id];
    const data = await this.fetchJSON(`${this.basePath}/people/${id}.json`);
    if (data) this.cache.people[id] = data;
    return data;
  }

  /** Get a single family by ID. */
  async getFamily(id) {
    if (this.cache.families[id]) return this.cache.families[id];
    const data = await this.fetchJSON(`${this.basePath}/families/${id}.json`);
    if (data) this.cache.families[id] = data;
    return data;
  }

  /** Get a single event by ID. */
  async getEvent(id) {
    if (this.cache.events[id]) return this.cache.events[id];
    const data = await this.fetchJSON(`${this.basePath}/events/${id}.json`);
    if (data) this.cache.events[id] = data;
    return data;
  }

  /** Load all people (full records). Fetches in parallel. */
  async getAllPeople() {
    await this.loadIndexes();
    const promises = this.indexes.people.map(entry => this.getPerson(entry.id));
    return (await Promise.all(promises)).filter(Boolean);
  }

  /** Load all families (full records). */
  async getAllFamilies() {
    await this.loadIndexes();
    const promises = this.indexes.families.map(entry => this.getFamily(entry.id));
    return (await Promise.all(promises)).filter(Boolean);
  }

  /** Load all events (full records). */
  async getAllEvents() {
    await this.loadIndexes();
    const promises = this.indexes.events.map(entry => this.getEvent(entry.id));
    return (await Promise.all(promises)).filter(Boolean);
  }

  /** Get people index entries (lightweight, no full fetch needed). */
  async getPeopleIndex() {
    await this.loadIndexes();
    return this.indexes.people;
  }

  /** Get families index entries. */
  async getFamiliesIndex() {
    await this.loadIndexes();
    return this.indexes.families;
  }

  /** Get events index entries. */
  async getEventsIndex() {
    await this.loadIndexes();
    return this.indexes.events;
  }

  /** Find all families that include a given person ID as a partner. */
  async getFamiliesForPerson(personId) {
    await this.loadIndexes();
    const matching = this.indexes.families.filter(
      f => f.partners && f.partners.includes(personId)
    );
    return Promise.all(matching.map(f => this.getFamily(f.id)));
  }

  /** Find siblings: people who share a family with this person as children. */
  async getSiblings(personId) {
    await this.loadIndexes();
    const allFamilies = await this.getAllFamilies();
    const siblingIds = new Set();
    for (const family of allFamilies) {
      if (family.children && family.children.includes(personId)) {
        family.children.forEach(childId => {
          if (childId !== personId) siblingIds.add(childId);
        });
      }
    }
    return Promise.all([...siblingIds].map(id => this.getPerson(id)));
  }

  /** Get events filtered by era tag. */
  async getEventsByEra(era) {
    await this.loadIndexes();
    const matching = this.indexes.events.filter(e => e.era === era);
    return Promise.all(matching.map(e => this.getEvent(e.id)));
  }

  /** Get events that reference a specific person. */
  async getEventsForPerson(personId) {
    await this.loadIndexes();
    const matching = this.indexes.events.filter(
      e => e.people && e.people.includes(personId)
    );
    return Promise.all(matching.map(e => this.getEvent(e.id)));
  }

  /** Search people index by name (case-insensitive partial match). */
  async searchPeople(query) {
    await this.loadIndexes();
    const q = query.toLowerCase();
    return this.indexes.people.filter(
      p => p.name.toLowerCase().includes(q)
    );
  }

  /** Fetch markdown content from content/ directory. */
  async getContent(relativePath) {
    try {
      const response = await fetch(`${this.basePath}/../content/${relativePath}`);
      if (!response.ok) throw new Error(`Failed to load content/${relativePath}`);
      return await response.text();
    } catch (err) {
      console.error(`DataLoader content error: ${err.message}`);
      return null;
    }
  }
}
