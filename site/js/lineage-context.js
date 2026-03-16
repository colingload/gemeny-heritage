/**
 * Lineage Context — Tracks which family wing the user is browsing.
 *
 * Sets CSS custom properties and a data attribute on <html> so theming
 * adapts automatically without touching existing CSS rules.
 */

const LineageContext = {
  _current: null, // 'gemeny' | 'gload' | null

  FAMILIES: {
    gemeny: {
      key: 'gemeny',
      name: 'Gemeny',
      tagline: 'Four Families \u00b7 Five Centuries \u00b7 Three Countries',
      heroTitle: 'Our Family<br>Heritage',
      heroSubtitle: 'The story of <strong>Gordon &amp; Mary Gemeny</strong> \u2014 and the four lineages that converge in their children and grandchildren.',
      heroQuote: 'Gemeny \u00b7 Gordon/DuBois \u00b7 Sanderson \u00b7 Burgess',
      introText: 'Starting from <strong>Gordon &amp; Mary Gemeny</strong>, this archive traces four family lines back through centuries \u2014 from French Huguenots founding New Paltz to English knights in Tudor Warwickshire, from a sea captain lost at sea to Irish immigrants in Washington, from North Carolina farmers to Maryland craftsmen. <strong>165 ancestors. 520 years. Three countries.</strong>',
      branches: ['gemeny', 'gordon-dubois', 'sanderson', 'burgess'],
      rootAncestor: 'anthony-gemini-1730',
      accentColor: '#b8860b',
      accentHover: '#d4a017',
      branchCards: [
        { color: '#d4a017', name: 'Gemeny Line', desc: 'Anthony Gemini (1730) &rarr; Sea Captain &rarr; Pleasant View &rarr; Pop Gemeny &rarr; Gordon. English roots to 1506.' },
        { color: '#5e9acf', name: 'Gordon / DuBois', desc: 'French Huguenots (1626) &rarr; Dutch Hudson Valley &rarr; Irish immigrant &rarr; DC Freemasons &rarr; Myrtelle &rarr; Gordon.' },
        { color: '#c47a5e', name: 'Sanderson Line', desc: 'Craven County NC (1720) &rarr; Duplin County &rarr; Georgia &rarr; orphaned at 12 &rarr; Albert &rarr; Mary Amelia.' },
        { color: '#8e6aad', name: 'Burgess Line', desc: 'Port Tobacco MD (1685) &rarr; Charles County &rarr; Alexandria &rarr; DC &rarr; Flora Burgess &rarr; Mary Amelia.' }
      ],
      keyFigures: [
        { gen: 'Generation 0 \u00b7 Colonial', name: 'Anthony Gemini', dates: 'c. 1730', desc: 'Sailed to North America c. 1755. Married Katherine Richards in Salem. The founding ancestor of every Gemeny in America.' },
        { gen: 'Generation 0 \u00b7 Colonial', name: 'Katherine Richards', dates: 'c. 1730', desc: 'Wife of Anthony Gemini. Married October 17, 1756 in Salem, MA. Later married Ebenezer Aborn.' },
        { gen: 'Generation 1 \u00b7 Early Republic', name: 'John \u201cThe Sea Captain\u201d', dates: '1769 \u2013 ?', desc: "Ship\u2019s master who vanished at sea. His son was hidden in a cupboard to keep him from sailing on the final voyage." },
        { gen: 'Generation 1 \u00b7 Early Republic', name: 'Naomi Tewksbury', dates: 'c. 1770', desc: "Changed the family surname from Gemini to Gemeny. Operated a rooming house in Baltimore after John\u2019s disappearance." },
        { gen: 'Generation 2 \u00b7 Antebellum', name: 'John Gemeny II', dates: 'c. 1791 \u2013 c. 1870', desc: 'Built Pleasant View in Kinsale, VA. Father of nine children. Every living Gemeny descends from him and Matilda Figg.' },
        { gen: 'Generation 3 \u00b7 Civil War', name: 'Benjamin Gemeny', dates: '1835 \u2013 ?', desc: "Imprisoned as a Union spy in Confederate Virginia during the Civil War. Subject of Mary\u2019s memoir." },
        { gen: 'Generation 3 \u00b7 Civil War', name: 'Mary E. Roberts', dates: '1836 \u2013 1937', desc: 'Wrote \u201cA Reminiscence of the War of the Rebellion\u201d in 1913. Lived to be approximately 101 years old.' },
        { gen: 'Generation 5 \u00b7 Interwar', name: 'Andrew \u201cPop\u201d Gemeny', dates: '1896 \u2013 1989', desc: 'Recorded oral histories in the 1970s preserving firsthand accounts of early 20th century family life.' },
        { gen: 'Generation 6 \u00b7 Postwar', name: 'W. Gordon Gemeny', dates: '1930 \u2013 2017', desc: 'Authored the Thomas Gemini origin essay in 2002, tracing possible family roots to a 1540s engraver in England.' }
      ],
      lineageChain: [
        { name: 'Anthony Gemini', detail: 'c. 1730 \u00b7 Sailor \u00b7 Salem, MA', tag: 'Founding Ancestor' },
        { name: 'John \u201cThe Sea Captain\u201d Gemeny', detail: 'b. 1769, Salem \u00b7 Ship\u2019s Master \u00b7 Disappeared at sea', tag: 'Gen 1' },
        { name: 'John Gemeny II &amp; Matilda Figg', detail: 'c. 1791 \u2013 c. 1870 \u00b7 Kinsale, VA \u00b7 Built Pleasant View', tag: 'Gen 2' },
        { name: 'Andrew Gemeny', detail: 'c. 1840 \u00b7 Carpenter \u00b7 Royal Oak, MD', tag: 'Gen 3' },
        { name: 'Edgar Dean Gemeny', detail: 'c. 1865', tag: 'Gen 4' },
        { name: 'Andrew \u201cPop\u201d Gemeny &amp; Myrtelle Gordon', detail: '1896 \u2013 1989 \u00b7 Washington, DC \u00b7 Family storyteller', tag: 'Gen 5' },
        { name: 'William Gordon Gemeny &amp; Mary Amelia Sanderson', detail: '1930 \u2013 2017 \u00b7 Dowell, Calvert County, MD', tag: 'Gen 6' },
        { name: 'Steven \u00b7 Michael \u00b7 Amelia', detail: 'Three children of William &amp; Mary', tag: 'Gen 7' },
        { name: 'Colin Frederick Gload', detail: 'b. 1989, Rapid City, SD \u00b7 Project curator', tag: 'Gen 8' }
      ],
      stories: [
        { icon: '\ud83d\udcdc', title: 'A Reminiscence of the War of the Rebellion', author: 'Mary E. Roberts Gemeny, 1913', href: 'pages/civil-war-memoir.html' },
        { icon: '\ud83c\udfe1', title: 'Pleasant View & the Kinsale Years', author: 'From the family archives', href: 'pages/pleasant-view.html' },
        { icon: '\ud83d\udd0d', title: 'The Thomas Gemini Mystery', author: 'W. Gordon Gemeny, 2002', href: 'pages/thomas-gemini.html' },
        { icon: '\ud83c\udf45', title: 'Lucy Pittman\u2019s Green Tomato Pickles', author: 'A family recipe, c. 1890', href: 'pages/pickles.html' }
      ]
    },
    gload: {
      key: 'gload',
      name: 'Gload',
      tagline: 'Tracing the Gload Paternal Line',
      heroTitle: 'The Gload<br>Family',
      heroSubtitle: 'Tracing the Gload paternal line \u2014 Colin\u2019s father\u2019s heritage, from Maryland roots through American history.',
      heroQuote: null,
      introText: 'The Gload line represents Colin\u2019s paternal heritage \u2014 the other half of the story. Research is underway to trace the Gload surname back through Maryland, South Dakota, and beyond. This archive will grow as new records are uncovered.',
      branches: ['gload'],
      rootAncestor: null, // TBD as data grows
      accentColor: '#4a7c59',
      accentHover: '#5d9a6f',
      branchCards: [
        { color: '#4a7c59', name: 'Gload Line', desc: 'Frederick "Ted" Gload \u2192 Colin \u2192 Brody & Aurora. Maryland and South Dakota roots.' }
      ],
      keyFigures: [
        // Will be populated as research data is added
      ],
      lineageChain: [
        // Will be populated as research data is added
      ],
      stories: [
        // Will be populated as stories are written
      ]
    }
  },

  set(familyKey) {
    this._current = familyKey || null;
    document.documentElement.setAttribute('data-lineage', familyKey || '');
    if (familyKey && this.FAMILIES[familyKey]) {
      var f = this.FAMILIES[familyKey];
      document.documentElement.style.setProperty('--gold', f.accentColor);
      document.documentElement.style.setProperty('--gold-hover', f.accentHover);
    } else {
      document.documentElement.style.removeProperty('--gold');
      document.documentElement.style.removeProperty('--gold-hover');
    }
  },

  get: function() { return this._current; },
  getFamily: function() { return this._current ? this.FAMILIES[this._current] : null; },
  routePrefix: function() { return this._current ? '/' + this._current : ''; }
};
