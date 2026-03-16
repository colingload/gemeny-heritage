/**
 * Gemeny Heritage — LifeStory Generator
 *
 * Auto-generates a chronological narrative timeline for a person
 * from structured data, per LIFESTORY-SPEC.md.
 */

const LifeStory = {
  /**
   * Generate a sorted array of life events for a person.
   * Each event: { date, dateDisplay, age, category, categoryLabel, narrative, location }
   */
  async generate(person, loader) {
    const events = [];

    // Load connected data
    const [father, mother, families, siblings] = await Promise.all([
      person.parents && person.parents.father ? loader.getPerson(person.parents.father) : null,
      person.parents && person.parents.mother ? loader.getPerson(person.parents.mother) : null,
      loader.getFamiliesForPerson(person.id),
      loader.getSiblings(person.id)
    ]);

    const name = person.name.first;
    const heShe = person.gender === 'female' ? 'She' : 'He';
    const hisHer = person.gender === 'female' ? 'Her' : 'His';
    const himHer = person.gender === 'female' ? 'her' : 'him';

    // 1. Birth
    if (person.birth && person.birth.date) {
      let narrative = `${name} was born on ${this._fmtDate(person.birth.date, person.birth.date_precision)}`;
      if (person.birth.place) narrative += ` in ${person.birth.place}`;
      if (father && mother) {
        const fAge = this._calcAge(father.birth?.date, person.birth.date);
        const mAge = this._calcAge(mother.birth?.date, person.birth.date);
        narrative += `, to ${mother.name.first}`;
        if (mAge !== null) narrative += `, age ${mAge}`;
        narrative += `, and ${father.name.first}`;
        if (fAge !== null) narrative += `, age ${fAge}`;
      }
      narrative += '.';
      events.push(this._event(person.birth.date, 'birth', 'Birth', narrative, person.birth.place, person));
    }

    // 2. Residences
    if (person.residence) {
      for (const r of person.residence) {
        if (r.date) {
          let narrative = `${name} lived in ${r.place} in ${r.date}.`;
          if (r.census_notes) narrative += ` (${r.census_notes})`;
          events.push(this._event(r.date, 'residence', 'Residence', narrative, r.place, person));
        }
      }
    }

    // 3. Sibling births (younger siblings only)
    if (siblings && person.birth?.date) {
      for (const sib of siblings) {
        if (sib && sib.birth?.date && sib.birth.date > person.birth.date) {
          const rel = sib.gender === 'female' ? 'sister' : 'brother';
          let narrative = `${hisHer} ${rel} ${sib.name.first} was born`;
          if (sib.birth.place) narrative += ` in ${sib.birth.place}`;
          const age = this._calcAge(person.birth.date, sib.birth.date);
          if (age !== null) narrative += `, when ${name} was ${age}`;
          narrative += '.';
          events.push(this._event(sib.birth.date, 'birth_of_sibling', 'Sibling Born', narrative, sib.birth.place, person));
        }
      }
    }

    // 4. Parent deaths
    if (father && father.death?.date) {
      const fAge = this._calcAge(father.birth?.date, father.death.date);
      let narrative = `${hisHer} father ${father.name.first} passed away on ${this._fmtDate(father.death.date, father.death.date_precision)}`;
      if (father.death.place) narrative += ` in ${father.death.place}`;
      if (fAge !== null) narrative += `, at the age of ${fAge}`;
      narrative += '.';
      events.push(this._event(father.death.date, 'death_of_parent', 'Death of Father', narrative, father.death.place, person));
    }
    if (mother && mother.death?.date) {
      const mAge = this._calcAge(mother.birth?.date, mother.death.date);
      let narrative = `${hisHer} mother ${mother.name.first} passed away on ${this._fmtDate(mother.death.date, mother.death.date_precision)}`;
      if (mother.death.place) narrative += ` in ${mother.death.place}`;
      if (mAge !== null) narrative += `, at the age of ${mAge}`;
      narrative += '.';
      events.push(this._event(mother.death.date, 'death_of_parent', 'Death of Mother', narrative, mother.death.place, person));
    }

    // 5. Marriages and children
    for (const family of families) {
      const spouseId = family.partners.find(id => id !== person.id);
      const spouse = spouseId ? await loader.getPerson(spouseId) : null;

      // Marriage
      if (family.marriage?.date) {
        const age = this._calcAge(person.birth?.date, family.marriage.date);
        let narrative = `${name} married ${spouse ? spouse.name.first + ' ' + spouse.name.last : 'unknown'}`;
        if (family.marriage.place) narrative += ` in ${family.marriage.place}`;
        narrative += ` on ${this._fmtDate(family.marriage.date, family.marriage.date_precision || 'exact')}`;
        if (age !== null) narrative += `, when ${heShe.toLowerCase()} was ${age} years old`;
        narrative += '.';
        events.push(this._event(family.marriage.date, 'marriage', 'Marriage', narrative, family.marriage.place, person));
      }

      // Children births
      if (family.children) {
        for (const childId of family.children) {
          const child = await loader.getPerson(childId);
          if (child && child.birth?.date) {
            const rel = child.gender === 'female' ? 'daughter' : 'son';
            const age = this._calcAge(person.birth?.date, child.birth.date);
            let narrative = `${hisHer} ${rel} ${child.name.first} was born`;
            if (child.birth.place) narrative += ` in ${child.birth.place}`;
            narrative += ` on ${this._fmtDate(child.birth.date, child.birth.date_precision)}`;
            if (age !== null) narrative += `, when ${name} was ${age}`;
            narrative += '.';
            events.push(this._event(child.birth.date, 'birth_of_child', 'Child Born', narrative, child.birth.place, person));
          }
        }
      }

      // Spouse death (if spouse died before person)
      if (spouse && spouse.death?.date) {
        if (!person.death?.date || spouse.death.date < person.death.date) {
          const sAge = this._calcAge(spouse.birth?.date, spouse.death.date);
          const marriageYears = this._calcAge(family.marriage?.date, spouse.death.date);
          let narrative = `${hisHer} ${spouse.gender === 'female' ? 'wife' : 'husband'} ${spouse.name.first} passed away`;
          if (spouse.death.place) narrative += ` in ${spouse.death.place}`;
          narrative += ` on ${this._fmtDate(spouse.death.date, spouse.death.date_precision)}`;
          if (sAge !== null) narrative += `, at the age of ${sAge}`;
          if (marriageYears !== null) narrative += `. They had been married ${marriageYears} years`;
          narrative += '.';
          events.push(this._event(spouse.death.date, 'death_of_spouse', 'Death of Spouse', narrative, spouse.death.place, person));
        }
      }
    }

    // 6. Sibling deaths (if sibling died before person)
    if (siblings) {
      for (const sib of siblings) {
        if (sib && sib.death?.date) {
          if (!person.death?.date || sib.death.date < person.death.date) {
            const rel = sib.gender === 'female' ? 'sister' : 'brother';
            const age = this._calcAge(person.birth?.date, sib.death.date);
            let narrative = `${hisHer} ${rel} ${sib.name.first} died on ${this._fmtDate(sib.death.date, sib.death.date_precision)}`;
            if (age !== null) narrative += `, when ${name} was ${age}`;
            narrative += '.';
            events.push(this._event(sib.death.date, 'death_of_sibling', 'Sibling Died', narrative, null, person));
          }
        }
      }
    }

    // 7. Death
    if (person.death?.date) {
      const age = this._calcAge(person.birth?.date, person.death.date);
      let narrative = `${name} died on ${this._fmtDate(person.death.date, person.death.date_precision)}`;
      if (person.death.place) narrative += ` in ${person.death.place}`;
      if (age !== null) narrative += `, at the age of ${age}`;
      narrative += '.';
      events.push(this._event(person.death.date, 'death', 'Death', narrative, person.death.place, person));
    }

    // 8. Sort by date
    events.sort((a, b) => {
      const da = a.date.replace(/[^\d-]/g, '').padEnd(10, '0');
      const db = b.date.replace(/[^\d-]/g, '').padEnd(10, '0');
      return da.localeCompare(db);
    });

    // 9. Calculate age at each event
    for (const event of events) {
      event.age = this._calcAge(person.birth?.date, event.date);
    }

    return events;
  },

  /** Generate a 2-3 sentence life summary. */
  generateSummary(person, events) {
    const name = person.name.first + ' ' + person.name.last;
    const parts = [];

    if (person.birth?.date) {
      let s = `${name} was born on ${this._fmtDate(person.birth.date, person.birth.date_precision)}`;
      if (person.birth.place) s += ` in ${person.birth.place}`;
      s += '.';
      parts.push(s);
    }

    const marriages = events.filter(e => e.category === 'marriage');
    if (marriages.length > 0) {
      parts.push(marriages[0].narrative);
    }

    const childCount = events.filter(e => e.category === 'birth_of_child').length;
    if (childCount > 0) {
      const heShe = person.gender === 'female' ? 'She' : 'He';
      parts.push(`${heShe} had ${childCount} known ${childCount === 1 ? 'child' : 'children'}.`);
    }

    if (person.death?.date) {
      const age = this._calcAge(person.birth?.date, person.death.date);
      const heShe = person.gender === 'female' ? 'She' : 'He';
      let s = `${heShe} died on ${this._fmtDate(person.death.date, person.death.date_precision)}`;
      if (person.death.place) s += ` in ${person.death.place}`;
      if (age !== null) s += `, at the age of ${age}`;
      s += '.';
      parts.push(s);
    }

    return parts.join(' ') || 'Not enough data to generate a summary.';
  },

  _event(date, category, categoryLabel, narrative, location, person) {
    return {
      date: date || '',
      dateDisplay: this._fmtDate(date, null),
      category,
      categoryLabel,
      narrative,
      location: location || null,
      age: null // calculated after sorting
    };
  },

  _fmtDate(dateStr, precision) {
    if (!dateStr) return '?';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const parts = dateStr.split('-');
    const year = parts[0];
    const month = parts[1] ? parseInt(parts[1], 10) : null;
    const day = parts[2] ? parseInt(parts[2], 10) : null;

    if (precision === 'circa') return `c. ${year}`;
    if (precision === 'year' || (!month && !day)) return year;
    if (precision === 'month' || (month && !day)) return `${months[month - 1]} ${year}`;
    if (month && day) return `${day} ${months[month - 1]} ${year}`;
    return year;
  },

  _calcAge(birthDateStr, eventDateStr) {
    if (!birthDateStr || !eventDateStr) return null;
    const birth = new Date(birthDateStr);
    const event = new Date(eventDateStr);
    if (isNaN(birth) || isNaN(event)) return null;
    let age = event.getFullYear() - birth.getFullYear();
    const monthDiff = event.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && event.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  }
};
