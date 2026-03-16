/**
 * Gemeny Heritage — Timeline Page
 *
 * Renders a vertical timeline of family events, grouped by era.
 * Events come from data/events/ and also auto-generated from people's vital records.
 */

const TimelinePage = {
  ERAS: [
    { id: 'colonial', label: 'Colonial Era', range: 'Before 1776' },
    { id: 'early-republic', label: 'Early Republic', range: '1776–1820' },
    { id: 'antebellum', label: 'Antebellum', range: '1820–1860' },
    { id: 'civil-war', label: 'Civil War', range: '1861–1865' },
    { id: 'reconstruction', label: 'Reconstruction', range: '1865–1900' },
    { id: 'turn-of-century', label: 'Turn of Century', range: '1900–1920' },
    { id: 'interwar', label: 'Interwar', range: '1920–1940' },
    { id: 'wwii', label: 'World War II', range: '1941–1945' },
    { id: 'postwar', label: 'Postwar', range: '1945–1970' },
    { id: 'modern', label: 'Modern', range: '1970–2000' },
    { id: 'contemporary', label: 'Contemporary', range: '2000–Present' }
  ],

  async render(container, loader) {
    container.innerHTML = `
      <section class="page-header">
        <h1>Timeline</h1>
        <p class="page-subtitle">Browse family history by era — births, deaths, marriages, migrations, and milestones.</p>
        <div class="timeline-filters">
          <button class="filter-btn filter-active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="birth">Births</button>
          <button class="filter-btn" data-filter="death">Deaths</button>
          <button class="filter-btn" data-filter="marriage">Marriages</button>
          <button class="filter-btn" data-filter="event">Events</button>
        </div>
      </section>
      <div class="timeline-view" id="timeline-view">
        <div class="loading">Loading timeline...</div>
      </div>
    `;

    // Gather all timeline events
    const [people, families, events] = await Promise.all([
      loader.getAllPeople(),
      loader.getAllFamilies(),
      loader.getAllEvents()
    ]);

    const timelineEvents = [];

    // People vital events
    for (const person of people) {
      if (person.privacy === 'private') continue;
      const name = `${person.name.first} ${person.name.last}`;

      if (person.birth?.date) {
        timelineEvents.push({
          date: person.birth.date,
          year: parseInt(person.birth.date.substring(0, 4)),
          type: 'birth',
          title: `${name} born`,
          description: person.birth.place ? `Born in ${person.birth.place}` : null,
          personId: person.id,
          era: this._yearToEra(parseInt(person.birth.date.substring(0, 4)))
        });
      }

      if (person.death?.date) {
        timelineEvents.push({
          date: person.death.date,
          year: parseInt(person.death.date.substring(0, 4)),
          type: 'death',
          title: `${name} died`,
          description: person.death.place ? `Died in ${person.death.place}` : null,
          personId: person.id,
          era: this._yearToEra(parseInt(person.death.date.substring(0, 4)))
        });
      }
    }

    // Family events (marriages)
    for (const family of families) {
      if (family.marriage?.date) {
        const names = [];
        for (const pid of family.partners) {
          const p = people.find(pp => pp.id === pid);
          if (p) names.push(`${p.name.first} ${p.name.last}`);
        }
        timelineEvents.push({
          date: family.marriage.date,
          year: parseInt(family.marriage.date.substring(0, 4)),
          type: 'marriage',
          title: names.join(' & ') + ' married',
          description: family.marriage.place ? `Married in ${family.marriage.place}` : null,
          personId: family.partners[0],
          era: this._yearToEra(parseInt(family.marriage.date.substring(0, 4)))
        });
      }
    }

    // Standalone events
    for (const event of events) {
      timelineEvents.push({
        date: event.date_start || '',
        year: event.date_start ? parseInt(event.date_start.substring(0, 4)) : 0,
        type: 'event',
        title: event.title,
        description: event.description,
        personId: event.people?.[0] || null,
        era: event.era || this._yearToEra(event.date_start ? parseInt(event.date_start.substring(0, 4)) : 0)
      });
    }

    // Sort by date
    timelineEvents.sort((a, b) => a.year - b.year || a.date.localeCompare(b.date));

    this._allEvents = timelineEvents;
    this._renderTimeline(container, 'all');

    // Wire filters
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-active'));
        btn.classList.add('filter-active');
        this._renderTimeline(container, btn.dataset.filter);
      });
    });
  },

  _renderTimeline(container, filter) {
    const view = container.querySelector('#timeline-view');
    const events = filter === 'all' ? this._allEvents : this._allEvents.filter(e => e.type === filter);

    if (events.length === 0) {
      view.innerHTML = '<p class="empty-state">No events to display.</p>';
      return;
    }

    // Group by era
    let html = '<div class="timeline-track">';
    let currentEra = null;

    for (const event of events) {
      if (event.era !== currentEra) {
        if (currentEra !== null) html += '</div>'; // close previous era group
        currentEra = event.era;
        const eraInfo = this.ERAS.find(e => e.id === currentEra) || { label: currentEra, range: '' };
        html += `
          <div class="timeline-era" id="era-${currentEra}">
            <div class="timeline-era-header">
              <h2>${eraInfo.label}</h2>
              <span class="timeline-era-range">${eraInfo.range}</span>
            </div>
        `;
      }

      const typeIcon = this._typeIcon(event.type);
      html += `
        <div class="timeline-event timeline-event-${event.type}">
          <div class="timeline-event-marker">${typeIcon}</div>
          <div class="timeline-event-date">${event.year || '?'}</div>
          <div class="timeline-event-body">
            <h3 class="timeline-event-title">
              ${event.personId ? `<a href="#/person/${event.personId}">${event.title}</a>` : event.title}
            </h3>
            ${event.description ? `<p class="timeline-event-desc">${event.description}</p>` : ''}
          </div>
        </div>
      `;
    }

    if (currentEra !== null) html += '</div>'; // close last era group
    html += '</div>';

    view.innerHTML = html;
  },

  _yearToEra(year) {
    if (year < 1776) return 'colonial';
    if (year < 1820) return 'early-republic';
    if (year < 1860) return 'antebellum';
    if (year < 1866) return 'civil-war';
    if (year < 1900) return 'reconstruction';
    if (year < 1920) return 'turn-of-century';
    if (year < 1940) return 'interwar';
    if (year < 1946) return 'wwii';
    if (year < 1970) return 'postwar';
    if (year < 2000) return 'modern';
    return 'contemporary';
  },

  _typeIcon(type) {
    switch (type) {
      case 'birth': return '<span class="icon-birth" title="Birth">&#9679;</span>';
      case 'death': return '<span class="icon-death" title="Death">&#10013;</span>';
      case 'marriage': return '<span class="icon-marriage" title="Marriage">&#9829;</span>';
      case 'event': return '<span class="icon-event" title="Event">&#9733;</span>';
      default: return '<span>&#8226;</span>';
    }
  }
};
