/**
 * Gemeny Heritage — Stories Page
 *
 * Displays narratives, oral history recordings, research essays, and recipes.
 * Loads markdown content and renders it with the MarkdownRenderer.
 */

const StoriesPage = {
  SECTIONS: [
    {
      id: 'narratives',
      title: 'Family Narratives',
      description: 'Written stories, memoirs, and historical accounts.',
      items: [
        { path: 'narratives/civil-war-memoir.md', title: 'A Reminiscence of the War of the Rebellion', author: 'Mary Gemeny, 1913', icon: '&#9873;' },
        { path: 'narratives/pleasant-view-and-quilt.md', title: 'Pleasant View & The General Harrison Quilt', author: 'Family History', icon: '&#127968;' }
      ]
    },
    {
      id: 'research',
      title: 'Research',
      description: 'Genealogical research and origin studies.',
      items: [
        { path: 'research/thomas-gemini-origin.md', title: 'Thomas Gemini of Louvain — Possible Origin', author: 'W. Gordon Gemeny, 2002', icon: '&#128270;' }
      ]
    },
    {
      id: 'oral-history',
      title: 'Oral History',
      description: "Andrew \"Pop\" Gemeny's recorded recollections from the 1970s.",
      items: [
        { path: 'oral-history/tape-1-side-a-part-1.md', title: 'Tape 1, Side A, Part 1', author: 'Andrew Gemeny, c. 1974', icon: '&#127908;' }
      ]
    },
    {
      id: 'recipes',
      title: 'Family Recipes',
      description: 'Recipes passed down through the generations.',
      items: [
        { path: 'recipes/lucy-pittman-green-tomato-pickles.md', title: "Lucy Pittman's Green Tomato Pickles", author: 'Lucy Pittman Gemeny', icon: '&#127859;' }
      ]
    }
  ],

  async render(container, loader) {
    container.innerHTML = `
      <section class="page-header">
        <h1>Stories</h1>
        <p class="page-subtitle">Read Mary's Civil War memoir, listen to Pop's recordings, explore family research, and discover family recipes.</p>
      </section>
      <div class="stories-grid" id="stories-grid"></div>
      <div class="story-reader" id="story-reader" style="display:none"></div>
    `;

    this._loader = loader;
    this._renderIndex(container);
  },

  _renderIndex(container) {
    const grid = container.querySelector('#stories-grid');
    const reader = container.querySelector('#story-reader');
    grid.style.display = '';
    reader.style.display = 'none';

    let html = '';
    for (const section of this.SECTIONS) {
      html += `
        <div class="stories-section">
          <h2>${section.title}</h2>
          <p class="stories-section-desc">${section.description}</p>
          <div class="stories-list">
      `;
      for (const item of section.items) {
        html += `
          <button class="story-card" data-path="${item.path}">
            <span class="story-icon">${item.icon}</span>
            <div>
              <h3>${item.title}</h3>
              <p class="story-author">${item.author}</p>
            </div>
          </button>
        `;
      }
      html += '</div></div>';
    }
    grid.innerHTML = html;

    // Wire click handlers
    grid.querySelectorAll('.story-card').forEach(card => {
      card.addEventListener('click', () => {
        this._openStory(container, card.dataset.path);
      });
    });
  },

  async _openStory(container, path) {
    const grid = container.querySelector('#stories-grid');
    const reader = container.querySelector('#story-reader');
    grid.style.display = 'none';
    reader.style.display = '';
    reader.innerHTML = '<div class="loading">Loading story...</div>';

    const content = await this._loader.getContent(path);
    if (!content) {
      reader.innerHTML = `
        <button class="btn btn-back" id="story-back">Back to Stories</button>
        <div class="error-state"><p>Could not load this story.</p></div>
      `;
    } else {
      // Parse frontmatter and content
      const { meta, body } = this._parseFrontmatter(content);
      const rendered = MarkdownRenderer.render(body);

      reader.innerHTML = `
        <button class="btn btn-back" id="story-back">Back to Stories</button>
        ${meta.title ? `<h1 class="story-title">${meta.title}</h1>` : ''}
        ${meta.author ? `<p class="story-meta">By ${meta.author}</p>` : ''}
        ${meta.date ? `<p class="story-meta">${meta.date}</p>` : ''}
        <div class="story-content prose">${rendered}</div>
      `;
    }

    reader.querySelector('#story-back').addEventListener('click', () => {
      this._renderIndex(container);
    });
  },

  _parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: text };

    const meta = {};
    match[1].split('\n').forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) {
        meta[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
      }
    });
    return { meta, body: match[2] };
  }
};
