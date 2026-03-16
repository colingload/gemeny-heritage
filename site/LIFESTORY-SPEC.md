# LifeStory Generator Specification

## Overview

The LifeStory is a chronological narrative timeline generated automatically from structured data. It is NOT hand-written — it assembles itself from a person's JSON record, their family records, and the records of connected people (parents, spouse, siblings, children).

This is one of the key differentiators from gemeny.com's static approach and directly inspired by Ancestry.com's LifeStory feature, but with a warmer, more museum-like presentation.

## What a LifeStory Contains

A LifeStory for any person is a chronological list of **life events**, each with:

- **Date** (exact or approximate)
- **Age** at the time (calculated from birth date)
- **Event type** (life event, family event, historical event)
- **Category** (birth, residence, marriage, military, death, etc.)
- **Headline** (short title)
- **Narrative** (1-3 sentence description, written in third person)
- **Connected people** (with their photo/link if available)
- **Location** (place name, optionally mappable)

## Event Types and How They're Sourced

### Life Events (from the person's own record)

| Category | Source Field | Example Narrative |
|----------|------------|-------------------|
| `birth` | `person.birth` | "{Name} was born on {date} in {place}, to {mother}, age {age}, and {father}, age {age}." |
| `residence` | `person.residence[]` | "{Name} lived in {place} in {year}." + census_notes if available |
| `marriage` | `family.marriage` | "{Name} married {spouse} in {place} on {date}, when {he/she} was {age} years old." |
| `divorce` | `family.divorce` | "{Name} and {spouse} divorced in {year}." |
| `occupation` | `person.occupation` | "{Name} worked as {occupation}." (only if date context available) |
| `military` | `person.military[]` | "{Name} served in {branch/unit} during {conflict}." |
| `death` | `person.death` | "{Name} died on {date} in {place}, when {he/she} was {age} years old." |

### Family Events (from connected people's records)

| Category | Source | Example Narrative |
|----------|--------|-------------------|
| `birth_of_child` | children's birth records | "{His/Her} {son/daughter} {child_name} was born on {date} in {place}, when {Name} was {age}." |
| `birth_of_sibling` | siblings' birth records | "{His/Her} {brother/sister} {sibling_name} was born on {date}, when {Name} was {age}." |
| `death_of_parent` | parents' death records | "{His/Her} {father/mother} {parent_first_name} passed away on {date} in {place}, at the age of {parent_age}." |
| `death_of_spouse` | spouse's death record | "{His/Her} {wife/husband} {spouse_first_name} passed away on {date} in {place}, at the age of {spouse_age}. They had been married {years} years." |
| `death_of_sibling` | siblings' death records | "{His/Her} {brother/sister} {sibling_name} died on {date}, when {Name} was {age}." |
| `death_of_child` | children's death records | "{His/Her} {son/daughter} {child_name} passed away on {date}, at the age of {child_age}." |
| `marriage_of_child` | children's family records | "{His/Her} {son/daughter} {child_name} married {child_spouse} on {date}." |

### Historical Context Events (from events records, optional enrichment)

| Category | Source | Example |
|----------|--------|---------|
| `historical` | `data/events/` | Events tagged with the person's era or location that provide historical context |

## Life Summary

A separate short-form summary (2-3 sentences) is also generated for each person, following this template:

> When {Name} was born on {birth_date} in {birth_place}, {his/her} father, {father_first}, was {father_age} and {his/her} mother, {mother_first}, was {mother_age}. {He/She} married {spouse_name} on {marriage_date} in {marriage_place}. They had {n} children during their marriage. {He/She} died on {death_date} in {death_place}, at the age of {age}.

Adjust as needed: omit parts where data is missing, adjust for multiple marriages, etc.

## Generation Algorithm

```
function generateLifeStory(personId):
  person = loadPerson(personId)
  events = []
  
  // 1. Birth
  if person.birth.date:
    father = loadPerson(person.parents.father)
    mother = loadPerson(person.parents.mother)
    events.push(birthEvent(person, father, mother))
  
  // 2. Residences (from census/records)
  for residence in person.residence:
    events.push(residenceEvent(person, residence))
  
  // 3. Sibling births (if we want to include them)
  siblings = findSiblings(person)
  for sibling in siblings:
    if sibling.birth.date and sibling.birth.date > person.birth.date:
      events.push(siblingBirthEvent(person, sibling))
  
  // 4. Death of parents
  father = loadPerson(person.parents.father)
  if father and father.death.date:
    events.push(parentDeathEvent(person, father, "father"))
  mother = loadPerson(person.parents.mother)
  if mother and mother.death.date:
    events.push(parentDeathEvent(person, mother, "mother"))
  
  // 5. Marriage(s)
  families = findFamiliesForPerson(person.id)
  for family in families:
    spouse = getSpouse(family, person.id)
    events.push(marriageEvent(person, spouse, family))
    
    // 5a. Children births
    for childId in family.children:
      child = loadPerson(childId)
      if child.birth.date:
        events.push(childBirthEvent(person, child))
    
    // 5b. Spouse death
    if spouse.death.date and (not person.death.date or spouse.death.date < person.death.date):
      events.push(spouseDeathEvent(person, spouse, family))
  
  // 6. Death of siblings
  for sibling in siblings:
    if sibling.death.date and (not person.death.date or sibling.death.date < person.death.date):
      events.push(siblingDeathEvent(person, sibling))
  
  // 7. Death
  if person.death.date:
    events.push(deathEvent(person))
  
  // 8. Sort by date
  events.sort(by: date)
  
  // 9. Calculate age at each event
  for event in events:
    event.age = calculateAge(person.birth.date, event.date)
  
  return events
```

## Display Components

### Life Summary Card
- Photo (if available)
- Name and dates (birth year – death year)
- 2-3 sentence summary paragraph
- Family quick view: spouse, parents, children count

### Timeline
- Vertical timeline with date markers on the left
- Each event is a card with:
  - Date (left column, formatted naturally: "5 Jan 1930", "1935", "Apr 1940")
  - Age badge (right of date, e.g., "Age 10")
  - Event type label ("Life Event" or "Family Event")
  - Category label ("Birth", "Residence", "Marriage", "Death of father", etc.)
  - Narrative text
  - Connected person card (photo + name + dates) where relevant
  - Location pin (place name, link to map)

### Map View
- All life events with locations plotted on a map
- Click markers to see the event details
- Lines connecting residences in chronological order

## Privacy Controls

For living people (no death date, or flagged as private):
- Show name as "Private Living" in public view
- Full details visible only in authenticated/family view
- LifeStory generation skipped for private individuals
- Connected-person references use "Private" label

The `person.privacy` field controls this:

```json
{
  "privacy": "public" | "family" | "private"
}
```

Default: `"public"` for deceased persons, `"private"` for living persons (no death date).

## Age Calculation

```javascript
function calculateAge(birthDate, eventDate) {
  if (!birthDate || !eventDate) return null;
  const birth = new Date(birthDate);
  const event = new Date(eventDate);
  let age = event.getFullYear() - birth.getFullYear();
  const monthDiff = event.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && event.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
```

## Date Formatting

Display dates naturally, not in ISO format:
- Exact: "January 5, 1930" or "5 Jan 1930"
- Month: "January 1930"
- Year: "1930"
- Circa: "c. 1755"

For timeline left-column, use compact format:
- "5 Jan\n1930"
- "1935"
- "1 Apr\n1940"
