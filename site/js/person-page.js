/**
 * Gemeny Heritage — Person Profile Page
 *
 * Renders a person's profile with three tabs: Facts, Gallery, LifeStory.
 * Loads data from JSON, assembles family connections, and delegates
 * LifeStory generation to lifestory.js.
 */

const PersonPage = {
  async render(container, personId, loader) {
    container.innerHTML = '<div class="loading">Loading...</div>';

    const person = await loader.getPerson(personId);
    if (!person) {
      container.innerHTML = '<div class="error-state"><h2>Person not found</h2><p><a href="#/">Return home</a></p></div>';
      return;
    }

    // Privacy check
    if (person.privacy === 'private') {
      container.innerHTML = `
        <div class="person-private">
          <h2>Private Living</h2>
          <p>This person's information is private.</p>
          <p><a href="#/">Return home</a></p>
        </div>
      `;
      return;
    }

    // Fetch related data in parallel
    const [families, father, mother] = await Promise.all([
      loader.getFamiliesForPerson(personId),
      person.parents && person.parents.father ? loader.getPerson(person.parents.father) : null,
      person.parents && person.parents.mother ? loader.getPerson(person.parents.mother) : null
    ]);

    const fullName = this._formatName(person);
    const dates = this._formatLifespan(person);
    const pronoun = person.gender === 'female' ? 'she' : 'he';
    const possessive = person.gender === 'female' ? 'her' : 'his';

    container.innerHTML = `
      <div class="person-header">
        <div class="person-header-info">
          <h1 class="person-name">${fullName}</h1>
          <p class="person-dates">${dates}</p>
          ${person.generation ? `<span class="person-gen-badge">Generation ${person.generation}</span>` : ''}
          ${person.lineage_branch ? `<span class="person-branch-badge">${person.lineage_branch.replace(/-/g, ' ')}</span>` : ''}
        </div>
      </div>

      <div class="tabs">
        <button class="tab-btn tab-active" data-tab="facts">Facts</button>
        <button class="tab-btn" data-tab="gallery">Gallery</button>
        <button class="tab-btn" data-tab="lifestory">LifeStory</button>
      </div>

      <div class="tab-panel" id="tab-facts"></div>
      <div class="tab-panel tab-hidden" id="tab-gallery"></div>
      <div class="tab-panel tab-hidden" id="tab-lifestory"></div>
    `;

    // Wire up tabs
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('tab-active'));
        container.querySelectorAll('.tab-panel').forEach(p => p.classList.add('tab-hidden'));
        btn.classList.add('tab-active');
        container.querySelector(`#tab-${btn.dataset.tab}`).classList.remove('tab-hidden');

        // Lazy-load LifeStory on first click
        if (btn.dataset.tab === 'lifestory' && !this._lifestoryLoaded) {
          this._lifestoryLoaded = true;
          this._renderLifeStory(container.querySelector('#tab-lifestory'), person, loader);
        }
      });
    });

    // Render Facts tab immediately
    this._renderFacts(container.querySelector('#tab-facts'), person, families, father, mother, loader);

    // Render Gallery tab
    this._renderGallery(container.querySelector('#tab-gallery'), person);

    this._lifestoryLoaded = false;
  },

  _formatName(person) {
    const n = person.name;
    let name = n.first;
    if (n.middle) name += ' ' + n.middle;
    name += ' ' + n.last;
    if (n.suffix) name += ' ' + n.suffix;
    if (n.maiden) name += ` (born ${n.maiden})`;
    return name;
  },

  _formatLifespan(person) {
    const birth = person.birth && person.birth.date ? this._formatDate(person.birth.date, person.birth.date_precision) : '?';
    const death = person.death && person.death.date ? this._formatDate(person.death.date, person.death.date_precision) : (person.death ? '?' : 'present');
    const birthPlace = person.birth && person.birth.place ? `, ${person.birth.place}` : '';
    return `${birth}${birthPlace} – ${death}`;
  },

  _formatDate(dateStr, precision) {
    if (!dateStr) return '?';
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const parts = dateStr.split('-');
    const year = parts[0];
    const month = parts[1] ? parseInt(parts[1], 10) : null;
    const day = parts[2] ? parseInt(parts[2], 10) : null;

    switch (precision) {
      case 'exact':
        return month && day ? `${months[month - 1]} ${day}, ${year}` : year;
      case 'month':
        return month ? `${months[month - 1]} ${year}` : year;
      case 'year':
        return year;
      case 'circa':
        return `c. ${year}`;
      default:
        return year;
    }
  },

  async _renderFacts(panel, person, families, father, mother, loader) {
    let html = '<div class="facts-grid">';

    // Basic info
    html += '<div class="facts-section"><h3>Vital Information</h3><dl class="facts-list">';
    if (person.birth && person.birth.date) {
      html += `<dt>Born</dt><dd>${this._formatDate(person.birth.date, person.birth.date_precision)}`;
      if (person.birth.place) html += ` in ${person.birth.place}`;
      html += '</dd>';
    }
    if (person.death && person.death.date) {
      html += `<dt>Died</dt><dd>${this._formatDate(person.death.date, person.death.date_precision)}`;
      if (person.death.place) html += ` in ${person.death.place}`;
      html += '</dd>';
    }
    if (person.gender) {
      html += `<dt>Gender</dt><dd>${person.gender.charAt(0).toUpperCase() + person.gender.slice(1)}</dd>`;
    }
    if (person.occupation && person.occupation.length > 0) {
      html += `<dt>Occupation</dt><dd>${person.occupation.join(', ')}</dd>`;
    }
    html += '</dl></div>';

    // Family
    html += '<div class="facts-section"><h3>Family</h3><dl class="facts-list">';
    if (father) {
      html += `<dt>Father</dt><dd><a href="#/person/${father.id}">${father.name.first} ${father.name.last}</a></dd>`;
    }
    if (mother) {
      html += `<dt>Mother</dt><dd><a href="#/person/${mother.id}">${mother.name.first} ${mother.name.last}</a></dd>`;
    }

    for (const family of families) {
      const spouseId = family.partners.find(id => id !== person.id);
      if (spouseId) {
        const spouse = await loader.getPerson(spouseId);
        if (spouse) {
          html += `<dt>Spouse</dt><dd><a href="#/person/${spouse.id}">${spouse.name.first} ${spouse.name.last}</a>`;
          if (family.marriage && family.marriage.date) {
            html += ` (married ${this._formatDate(family.marriage.date, family.marriage.date_precision || 'exact')}`;
            if (family.marriage.place) html += `, ${family.marriage.place}`;
            html += ')';
          }
          html += '</dd>';
        }
      }

      if (family.children && family.children.length > 0) {
        html += '<dt>Children</dt><dd><ul class="children-list">';
        for (const childId of family.children) {
          const child = await loader.getPerson(childId);
          if (child) {
            html += `<li><a href="#/person/${child.id}">${child.name.first} ${child.name.last}</a>`;
            if (child.birth && child.birth.date) html += ` (b. ${child.birth.date.substring(0, 4)})`;
            html += '</li>';
          } else {
            html += `<li>${childId}</li>`;
          }
        }
        html += '</ul></dd>';
      }
    }
    html += '</dl></div>';

    // Residences
    if (person.residence && person.residence.length > 0) {
      html += '<div class="facts-section"><h3>Residences</h3><ul class="residence-list">';
      for (const r of person.residence) {
        html += `<li><strong>${r.date || '?'}</strong> — ${r.place}`;
        if (r.census_notes) html += ` <span class="census-note">(${r.census_notes})</span>`;
        html += '</li>';
      }
      html += '</ul></div>';
    }

    // Sources
    if (person.sources && person.sources.length > 0) {
      html += '<div class="facts-section"><h3>Sources</h3><ul class="source-list">';
      for (const s of person.sources) {
        html += `<li><span class="source-type">${s.type}</span>: ${s.note}</li>`;
      }
      html += '</ul></div>';
    }

    // Notes
    if (person.notes) {
      html += `<div class="facts-section"><h3>Notes</h3><p class="person-notes">${person.notes}</p></div>`;
    }

    // Tags
    if (person.tags && person.tags.length > 0) {
      html += '<div class="facts-section"><h3>Tags</h3><div class="tag-list">';
      person.tags.forEach(tag => {
        html += `<span class="tag">${tag}</span>`;
      });
      html += '</div></div>';
    }

    html += '</div>';
    panel.innerHTML = html;
  },

  _renderGallery(panel, person) {
    let html = '<div class="gallery-grid">';

    if (person.artifacts && person.artifacts.length > 0) {
      person.artifacts.forEach(artifact => {
        const ext = artifact.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
          html += `
            <div class="gallery-item">
              <img src="assets/${artifact}" alt="${artifact}" loading="lazy">
              <div class="gallery-caption">${artifact.split('/').pop().replace(/[-_]/g, ' ').replace(/\.\w+$/, '')}</div>
            </div>
          `;
        }
      });
    }

    if (person.narratives && person.narratives.length > 0) {
      html += '<h3 class="gallery-subhead">Related Stories</h3>';
      person.narratives.forEach(narrative => {
        const name = narrative.replace('narratives/', '').replace('.md', '').replace(/-/g, ' ');
        html += `<a href="#/stories" class="narrative-link">${name}</a>`;
      });
    }

    if (!person.artifacts?.length && !person.narratives?.length) {
      html += '<p class="empty-state">No artifacts or media have been added for this person yet.</p>';
    }

    html += '</div>';
    panel.innerHTML = html;
  },

  async _renderLifeStory(panel, person, loader) {
    panel.innerHTML = '<div class="loading">Generating LifeStory...</div>';
    const events = await LifeStory.generate(person, loader);
    const summary = LifeStory.generateSummary(person, events);

    let html = '<div class="lifestory">';

    // Summary card
    html += `
      <div class="lifestory-summary">
        <p>${summary}</p>
      </div>
    `;

    // Timeline
    if (events.length === 0) {
      html += '<p class="empty-state">Not enough data to generate a LifeStory timeline yet.</p>';
    } else {
      html += '<div class="lifestory-timeline">';
      for (const event of events) {
        html += `
          <div class="lifestory-event">
            <div class="lifestory-date">
              <span class="lifestory-date-text">${event.dateDisplay || '?'}</span>
              ${event.age !== null ? `<span class="lifestory-age">Age ${event.age}</span>` : ''}
            </div>
            <div class="lifestory-content">
              <span class="lifestory-category">${event.categoryLabel}</span>
              <p class="lifestory-narrative">${event.narrative}</p>
              ${event.location ? `<span class="lifestory-location">${event.location}</span>` : ''}
            </div>
          </div>
        `;
      }
      html += '</div>';
    }

    html += '</div>';
    panel.innerHTML = html;
  }
};
