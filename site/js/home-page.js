/**
 * Gemeny Heritage — Home Page
 *
 * Editorial-style landing page. Tells the family story,
 * not just a grid of links.
 */

const HomePage = {
  async render(container, loader) {
    const index = await loader.getPeopleIndex();
    const eventsIndex = await loader.getEventsIndex();
    const publicPeople = index.filter(p => p.privacy !== 'private');
    const generationCount = new Set(publicPeople.map(p => p.generation).filter(Boolean)).size;

    container.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <p class="hero-prelude">Est. 1756 &middot; Salem, Massachusetts</p>
          <h1>The Gemeny<br>Family</h1>
          <div class="hero-rule"></div>
          <p class="hero-subtitle">Nearly 300 years of American history.<br>From a sailor's arrival in colonial Salem through ${generationCount} generations.</p>
          <p class="hero-quote">&ldquo;Every Gemeny in this country descends from<br>John &lsquo;The Sea Captain&rsquo; Gemeny.&rdquo;</p>
        </div>
      </section>

      <section class="home-intro">
        <div class="home-intro-inner">
          <p>This is the story of one family &mdash; traced from <strong>Anthony Gemini</strong>, a sailor who arrived in North America circa 1755, through wars, westward migration, and the quiet rhythms of American life. Along the way: a sea captain who vanished, a Union spy imprisoned in Confederate Virginia, a quilt stitched in Baltimore, and a recipe for green tomato pickles.</p>
        </div>
      </section>

      <section class="home-nav-cards">
        <a href="#/tree" class="home-card">
          <span class="home-card-number">I</span>
          <h2>Family Tree</h2>
          <p>Navigate the branches from Anthony Gemini through ten generations.</p>
        </a>
        <a href="#/timeline" class="home-card">
          <span class="home-card-number">II</span>
          <h2>Timeline</h2>
          <p>Colonial Salem. The Civil War. Westward migration. Browse by era.</p>
        </a>
        <a href="#/stories" class="home-card">
          <span class="home-card-number">III</span>
          <h2>Stories</h2>
          <p>Mary&rsquo;s war memoir. Pop&rsquo;s recordings. The Thomas Gemini mystery.</p>
        </a>
        <a href="#/artifacts" class="home-card">
          <span class="home-card-number">IV</span>
          <h2>Artifacts</h2>
          <p>Photographs, documents, the General Harrison Quilt, and more.</p>
        </a>
      </section>

      <section class="home-featured">
        <div class="home-featured-inner">
          <h2 class="home-section-title">Key Figures</h2>
          <div class="home-figures" id="home-figures"></div>
        </div>
      </section>

      <section class="home-moments">
        <div class="home-moments-inner">
          <h2 class="home-section-title">Moments in Time</h2>
          <div class="home-timeline" id="home-timeline"></div>
        </div>
      </section>

      <section class="home-cta">
        <p>This is a living archive. If you have corrections, photos, stories, or memories to contribute &mdash;</p>
        <a href="#/about" class="btn">Learn More</a>
      </section>
    `;

    // Key figures — hand-pick the most interesting people
    const keyIds = [
      'anthony-gemini-1730',
      'john-gemeny-1769',
      'john-gemeny-ii-1791',
      'benjamin-gemeny-1835',
      'mary-roberts-1836',
      'andrew-gemeny-1896',
      'william-gordon-gemeny-1930'
    ];

    const figuresEl = container.querySelector('#home-figures');
    const figureDescriptions = {
      'anthony-gemini-1730': 'Sailed to North America c. 1755. Married Katherine Richards in Salem. The founding ancestor.',
      'john-gemeny-1769': 'Ship\'s master who vanished at sea. His son was hidden in a cupboard to keep him from sailing.',
      'john-gemeny-ii-1791': 'Built Pleasant View in Kinsale, VA. Father of nine. Every Gemeny descends from him.',
      'benjamin-gemeny-1835': 'Imprisoned as a Union spy in Confederate Virginia during the Civil War.',
      'mary-roberts-1836': 'Wrote "A Reminiscence of the War of the Rebellion" in 1913, at age 77. Lived to 101.',
      'andrew-gemeny-1896': '"Pop" Gemeny. Recorded oral histories in the 1970s preserving family stories.',
      'william-gordon-gemeny-1930': 'Authored the Thomas Gemini origin essay. Traced possible roots to 1540s England.'
    };

    let figuresHtml = '';
    for (const id of keyIds) {
      const p = publicPeople.find(pp => pp.id === id);
      if (!p) continue;
      const desc = figureDescriptions[id] || '';
      figuresHtml += `
        <a href="#/person/${p.id}" class="home-figure">
          <div class="home-figure-gen">Gen ${p.generation ?? '?'}</div>
          <h3>${p.name}</h3>
          <div class="home-figure-dates">${p.birth_year || '?'} &ndash; ${p.death_year || ''}</div>
          <p>${desc}</p>
        </a>
      `;
    }
    figuresEl.innerHTML = figuresHtml;

    // Moments — from events index
    const timelineEl = container.querySelector('#home-timeline');
    const allEvents = await loader.getAllEvents();
    let momentsHtml = '';
    for (const evt of allEvents.sort((a, b) => (a.date_start || '').localeCompare(b.date_start || ''))) {
      momentsHtml += `
        <div class="home-moment">
          <div class="home-moment-date">${evt.date_start || '?'}</div>
          <div class="home-moment-body">
            <h3>${evt.title}</h3>
            <p>${evt.description || ''}</p>
          </div>
        </div>
      `;
    }
    timelineEl.innerHTML = momentsHtml || '<p class="empty-state">Timeline events are being added.</p>';
  }
};
