/**
 * Gemeny Heritage — Search
 *
 * Client-side search across people, events, and content.
 * Uses the data indexes for fast filtering without loading full records.
 */

const SearchPage = {
  async render(container, loader) {
    container.innerHTML = `
      <section class="page-header">
        <h1>Search</h1>
        <div class="search-box">
          <input type="text" id="search-input" class="search-input" placeholder="Search people, events, stories..." autofocus>
        </div>
      </section>
      <div class="search-results" id="search-results">
        <p class="search-hint">Type a name, place, or keyword to search.</p>
      </div>
    `;

    this._loader = loader;
    await loader.loadIndexes();

    const input = container.querySelector('#search-input');
    let debounceTimer;

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this._doSearch(container, input.value.trim());
      }, 250);
    });

    // Check if there's a query in hash
    const hashQuery = window.location.hash.match(/query=([^&]+)/);
    if (hashQuery) {
      input.value = decodeURIComponent(hashQuery[1]);
      this._doSearch(container, input.value.trim());
    }
  },

  _doSearch(container, query) {
    const results = container.querySelector('#search-results');

    if (!query) {
      results.innerHTML = '<p class="search-hint">Type a name, place, or keyword to search.</p>';
      return;
    }

    const q = query.toLowerCase();
    const matches = [];

    // Search people
    const peopleIndex = this._loader.indexes.people || [];
    for (const person of peopleIndex) {
      if (person.privacy === 'private') continue;
      const searchText = `${person.name} ${person.birth_year || ''} ${person.death_year || ''} ${person.lineage_branch || ''}`.toLowerCase();
      if (searchText.includes(q)) {
        matches.push({
          type: 'person',
          title: person.name,
          subtitle: `${person.birth_year || '?'} – ${person.death_year || 'present'}${person.generation ? ` | Generation ${person.generation}` : ''}`,
          href: `#/person/${person.id}`
        });
      }
    }

    // Search events
    const eventsIndex = this._loader.indexes.events || [];
    for (const event of eventsIndex) {
      const searchText = `${event.title || ''} ${event.era || ''} ${event.category || ''}`.toLowerCase();
      if (searchText.includes(q)) {
        matches.push({
          type: 'event',
          title: event.title,
          subtitle: `${event.date_start || '?'} | ${event.era || ''}`,
          href: `#/timeline`
        });
      }
    }

    // Search stories (static list from StoriesPage)
    if (typeof StoriesPage !== 'undefined') {
      for (const section of StoriesPage.SECTIONS) {
        for (const item of section.items) {
          if (`${item.title} ${item.author}`.toLowerCase().includes(q)) {
            matches.push({
              type: 'story',
              title: item.title,
              subtitle: item.author,
              href: '#/stories'
            });
          }
        }
      }
    }

    if (matches.length === 0) {
      results.innerHTML = `<p class="search-empty">No results found for "${query}".</p>`;
      return;
    }

    let html = `<p class="search-count">${matches.length} result${matches.length !== 1 ? 's' : ''}</p>`;
    html += '<div class="search-list">';

    for (const match of matches) {
      html += `
        <a href="${match.href}" class="search-result">
          <span class="search-result-type search-type-${match.type}">${match.type}</span>
          <div>
            <div class="search-result-title">${match.title}</div>
            <div class="search-result-subtitle">${match.subtitle}</div>
          </div>
        </a>
      `;
    }

    html += '</div>';
    results.innerHTML = html;
  }
};
