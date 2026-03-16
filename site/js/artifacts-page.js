/**
 * Gemeny Heritage — Artifacts Page
 *
 * Gallery of photos, documents, audio recordings, and physical artifacts.
 * Data sourced from assets/MANIFEST.md categories and person artifact references.
 */

const ArtifactsPage = {
  CATEGORIES: [
    { id: 'photos', title: 'Photographs', icon: '&#128247;', dir: 'photos' },
    { id: 'artifacts', title: 'Artifacts & Heirlooms', icon: '&#127970;', dir: 'artifacts' },
    { id: 'documents', title: 'Documents & Records', icon: '&#128196;', dir: 'documents' },
    { id: 'audio', title: 'Audio Recordings', icon: '&#127908;', dir: 'audio' }
  ],

  async render(container, loader) {
    container.innerHTML = `
      <section class="page-header">
        <h1>Artifacts</h1>
        <p class="page-subtitle">Photos, documents, the General Harrison Quilt, tin types, and more.</p>
      </section>
      <div class="artifacts-content" id="artifacts-content"></div>
      <div class="lightbox" id="lightbox" style="display:none">
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close">&times;</button>
          <img class="lightbox-img" src="" alt="">
          <div class="lightbox-caption"></div>
        </div>
      </div>
    `;

    // Collect artifacts referenced by people
    const people = await loader.getAllPeople();
    const artifactRefs = new Map();

    for (const person of people) {
      if (person.artifacts) {
        for (const artifact of person.artifacts) {
          if (!artifactRefs.has(artifact)) {
            artifactRefs.set(artifact, []);
          }
          artifactRefs.get(artifact).push(`${person.name.first} ${person.name.last}`);
        }
      }
    }

    const content = container.querySelector('#artifacts-content');
    let html = '';

    for (const cat of this.CATEGORIES) {
      const catArtifacts = [...artifactRefs.entries()].filter(([path]) => path.startsWith(cat.dir + '/'));

      html += `
        <div class="artifact-category">
          <h2><span class="artifact-cat-icon">${cat.icon}</span> ${cat.title}</h2>
      `;

      if (catArtifacts.length === 0) {
        html += '<p class="empty-state">Artifacts in this category are being digitized and added. Check back soon.</p>';
      } else {
        html += '<div class="artifact-grid">';
        for (const [path, associatedPeople] of catArtifacts) {
          const ext = path.split('.').pop().toLowerCase();
          const caption = path.split('/').pop().replace(/[-_]/g, ' ').replace(/\.\w+$/, '');

          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            html += `
              <div class="artifact-item" data-src="assets/${path}" data-caption="${caption}">
                <img src="assets/${path}" alt="${caption}" loading="lazy">
                <div class="artifact-label">${caption}</div>
                <div class="artifact-people">${associatedPeople.join(', ')}</div>
              </div>
            `;
          } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
            html += `
              <div class="artifact-item artifact-audio">
                <div class="artifact-label">${caption}</div>
                <div class="artifact-people">${associatedPeople.join(', ')}</div>
                <div class="artifact-audio-player" data-src="assets/${path}" data-title="${caption}"></div>
              </div>
            `;
          } else {
            html += `
              <div class="artifact-item">
                <a href="assets/${path}" target="_blank" class="artifact-link">${caption}</a>
                <div class="artifact-people">${associatedPeople.join(', ')}</div>
              </div>
            `;
          }
        }
        html += '</div>';
      }

      html += '</div>';
    }

    if (artifactRefs.size === 0) {
      html = `
        <div class="empty-state-large">
          <p>Artifacts are being digitized and added to the collection.</p>
          <p>Photos, scanned documents, audio recordings, and more will appear here as they are processed.</p>
        </div>
      `;
    }

    content.innerHTML = html;

    // Wire lightbox for images
    const lightbox = container.querySelector('#lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');

    content.querySelectorAll('.artifact-item[data-src]').forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        lightboxImg.src = item.dataset.src;
        lightboxCaption.textContent = item.dataset.caption;
        lightbox.style.display = 'flex';
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', () => {
      lightbox.style.display = 'none';
    });

    // Wire audio players
    content.querySelectorAll('.artifact-audio-player').forEach(el => {
      const player = AudioPlayer.create(el.dataset.src, el.dataset.title);
      el.appendChild(player);
    });
  }
};
