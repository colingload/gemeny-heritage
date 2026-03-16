/**
 * Gemeny Heritage — Family Tree Renderer
 *
 * Renders an interactive, expandable family tree using SVG.
 * Starts from the earliest known ancestor and lets users expand branches.
 */

const TreePage = {
  NODE_W: 180,
  NODE_H: 70,
  H_GAP: 40,
  V_GAP: 100,

  async render(container, loader) {
    container.innerHTML = `
      <section class="page-header">
        <h1>Family Tree</h1>
        <p class="page-subtitle">Click any person to expand their branch or view their profile.</p>
        <div class="tree-controls">
          <label>Start from:
            <select id="tree-root-select"></select>
          </label>
          <button id="tree-expand-all" class="btn btn-small">Expand All</button>
        </div>
      </section>
      <div class="tree-container" id="tree-container">
        <div class="loading">Loading family tree...</div>
      </div>
    `;

    this._loader = loader;
    this._expanded = new Set();
    this._familyCache = {};
    this._personCache = {};

    // Load all data
    const [people, families] = await Promise.all([
      loader.getAllPeople(),
      loader.getAllFamilies()
    ]);

    this._allPeople = {};
    people.forEach(p => { this._allPeople[p.id] = p; this._personCache[p.id] = p; });

    this._allFamilies = families;

    // Index: person -> families where they are a partner
    this._partnerFamilies = {};
    families.forEach(f => {
      (f.partners || []).forEach(pid => {
        if (!this._partnerFamilies[pid]) this._partnerFamilies[pid] = [];
        this._partnerFamilies[pid].push(f);
      });
    });

    // Find root candidates (people with no parents in our data)
    const rootCandidates = people.filter(p => {
      if (p.privacy === 'private') return false;
      const fatherId = p.parents?.father;
      const motherId = p.parents?.mother;
      const hasParentInData = (fatherId && this._allPeople[fatherId]) || (motherId && this._allPeople[motherId]);
      return !hasParentInData;
    }).sort((a, b) => (a.generation || 99) - (b.generation || 99));

    // Populate root selector
    const select = container.querySelector('#tree-root-select');
    rootCandidates.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name.first} ${p.name.last} (Gen ${p.generation || '?'})`;
      select.appendChild(opt);
    });

    // Also add non-root people
    people.filter(p => !rootCandidates.includes(p) && p.privacy !== 'private')
      .forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.name.first} ${p.name.last} (Gen ${p.generation || '?'})`;
        select.appendChild(opt);
      });

    select.addEventListener('change', () => this._renderTree(container, select.value));

    container.querySelector('#tree-expand-all').addEventListener('click', () => {
      this._expandAll(container, select.value);
    });

    // Render from first root
    if (rootCandidates.length > 0) {
      this._expanded.add(rootCandidates[0].id);
      this._renderTree(container, rootCandidates[0].id);
    } else if (people.length > 0) {
      this._expanded.add(people[0].id);
      this._renderTree(container, people[0].id);
    } else {
      container.querySelector('#tree-container').innerHTML = '<p class="empty-state">No family data available yet.</p>';
    }
  },

  _renderTree(container, rootId) {
    const treeContainer = container.querySelector('#tree-container');
    this._expanded.add(rootId);

    // Build tree structure
    const tree = this._buildTree(rootId, 0);
    if (!tree) {
      treeContainer.innerHTML = '<p class="empty-state">Could not build tree from this person.</p>';
      return;
    }

    // Layout
    this._assignPositions(tree, 0, 0);

    // Calculate bounds
    const bounds = this._getBounds(tree);
    const padding = 40;
    const svgW = bounds.maxX + this.NODE_W + padding * 2;
    const svgH = bounds.maxY + this.NODE_H + padding * 2;

    let svg = `<svg class="tree-svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">`;

    // Draw connections
    svg += this._drawConnections(tree, padding);

    // Draw nodes
    svg += this._drawNodes(tree, padding);

    svg += '</svg>';
    treeContainer.innerHTML = `<div class="tree-scroll">${svg}</div>`;

    // Wire click handlers
    treeContainer.querySelectorAll('.tree-node').forEach(node => {
      node.addEventListener('click', (e) => {
        const id = node.dataset.id;
        if (e.shiftKey || e.ctrlKey) {
          // Navigate to person page
          window.location.hash = `#/person/${id}`;
        } else {
          // Toggle expand
          if (this._expanded.has(id)) {
            this._expanded.delete(id);
          } else {
            this._expanded.add(id);
          }
          this._renderTree(container, rootId);
        }
      });
    });
  },

  _buildTree(personId, depth) {
    const person = this._allPeople[personId];
    if (!person) return null;

    const node = {
      id: personId,
      person,
      depth,
      children: [],
      spouse: null,
      x: 0,
      y: 0
    };

    // Find spouse and children
    const families = this._partnerFamilies[personId] || [];
    if (families.length > 0) {
      const family = families[0]; // primary family
      const spouseId = family.partners.find(id => id !== personId);
      if (spouseId && this._allPeople[spouseId]) {
        node.spouse = this._allPeople[spouseId];
      }

      if (this._expanded.has(personId) && family.children) {
        for (const childId of family.children) {
          const childNode = this._buildTree(childId, depth + 1);
          if (childNode) node.children.push(childNode);
        }
      }
    }

    return node;
  },

  _assignPositions(node, x, y) {
    node.y = y;

    if (node.children.length === 0) {
      node.x = x;
      return x + this.NODE_W + this.H_GAP;
    }

    let nextX = x;
    for (const child of node.children) {
      nextX = this._assignPositions(child, nextX, y + this.NODE_H + this.V_GAP);
    }

    // Center parent over children
    const firstChild = node.children[0];
    const lastChild = node.children[node.children.length - 1];
    node.x = (firstChild.x + lastChild.x) / 2;

    return nextX;
  },

  _getBounds(node) {
    let maxX = node.x;
    let maxY = node.y;
    for (const child of node.children) {
      const childBounds = this._getBounds(child);
      maxX = Math.max(maxX, childBounds.maxX);
      maxY = Math.max(maxY, childBounds.maxY);
    }
    return { maxX, maxY };
  },

  _drawConnections(node, padding) {
    let svg = '';
    const px = node.x + padding + this.NODE_W / 2;
    const py = node.y + padding + this.NODE_H;

    for (const child of node.children) {
      const cx = child.x + padding + this.NODE_W / 2;
      const cy = child.y + padding;
      const midY = py + (cy - py) / 2;
      svg += `<path d="M ${px} ${py} C ${px} ${midY}, ${cx} ${midY}, ${cx} ${cy}" class="tree-line"/>`;
    }

    for (const child of node.children) {
      svg += this._drawConnections(child, padding);
    }

    return svg;
  },

  _drawNodes(node, padding) {
    let svg = '';
    const x = node.x + padding;
    const y = node.y + padding;
    const person = node.person;
    const hasChildren = (this._partnerFamilies[node.id] || []).some(f => f.children?.length > 0);
    const isExpanded = this._expanded.has(node.id);

    svg += `<g class="tree-node" data-id="${node.id}" style="cursor:pointer">`;
    svg += `<rect x="${x}" y="${y}" width="${this.NODE_W}" height="${this.NODE_H}" rx="6" class="tree-node-rect ${isExpanded && hasChildren ? 'tree-node-expanded' : ''}"/>`;
    svg += `<text x="${x + this.NODE_W / 2}" y="${y + 25}" class="tree-node-name">${person.name.first} ${person.name.last}</text>`;

    const dates = `${person.birth?.date?.substring(0, 4) || '?'} – ${person.death?.date?.substring(0, 4) || ''}`;
    svg += `<text x="${x + this.NODE_W / 2}" y="${y + 45}" class="tree-node-dates">${dates}</text>`;

    if (hasChildren && !isExpanded) {
      svg += `<text x="${x + this.NODE_W / 2}" y="${y + 62}" class="tree-node-expand">+</text>`;
    }

    svg += '</g>';

    // Spouse node (small, attached)
    if (node.spouse) {
      const sx = x + this.NODE_W + 5;
      const sy = y + 5;
      svg += `<g class="tree-spouse" style="cursor:pointer" onclick="location.hash='#/person/${node.spouse.id}'">`;
      svg += `<rect x="${sx}" y="${sy}" width="80" height="${this.NODE_H - 10}" rx="4" class="tree-spouse-rect"/>`;
      svg += `<text x="${sx + 40}" y="${sy + 22}" class="tree-spouse-name">${node.spouse.name.first}</text>`;
      svg += `<text x="${sx + 40}" y="${sy + 38}" class="tree-spouse-name">${node.spouse.name.last}</text>`;
      svg += '</g>';
    }

    for (const child of node.children) {
      svg += this._drawNodes(child, padding);
    }

    return svg;
  },

  _expandAll(container, rootId) {
    // Recursively expand all nodes
    const expandRecursive = (personId) => {
      this._expanded.add(personId);
      const families = this._partnerFamilies[personId] || [];
      for (const family of families) {
        if (family.children) {
          family.children.forEach(childId => {
            if (this._allPeople[childId]) expandRecursive(childId);
          });
        }
      }
    };
    expandRecursive(rootId);
    this._renderTree(container, rootId);
  }
};
