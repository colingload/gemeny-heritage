#!/usr/bin/env node
/**
 * Batch-create all Sanderson-side ancestors from Ancestry tree screenshots.
 */
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'people');

function create(id, data) {
  const file = path.join(dir, id + '.json');
  if (fs.existsSync(file)) { console.log('  SKIP (exists): ' + id); return; }
  const record = {
    "$schema": "person",
    "id": id,
    "name": { "first": data.first, "middle": data.middle || null, "last": data.last, "maiden": data.maiden || null, "suffix": null, "alternate_spellings": data.alt || [] },
    "birth": { "date": data.bDate || null, "date_precision": data.bPrec || "year", "place": data.bPlace || null },
    "death": { "date": data.dDate || null, "date_precision": data.dPrec || "year", "place": data.dPlace || null },
    "burial": data.burial ? { "place": data.burial } : null,
    "gender": data.gender || "male",
    "occupation": data.occ || [],
    "residence": [],
    "generation": null,
    "lineage_branch": data.branch || "sanderson-burgess",
    "parents": { "father": data.father || null, "mother": data.mother || null },
    "privacy": "public",
    "tags": data.tags || [],
    "sources": [{ "type": "ancestry", "note": "Ancestry.com — Steven Gemeny Family Tree" }],
    "artifacts": [],
    "narratives": [],
    "notes": data.notes || ""
  };
  fs.writeFileSync(file, JSON.stringify(record, null, 2));
  console.log('  CREATED: ' + id);
}

// ===== SMITH LINE (Mary E. Smith's parents) =====
create('james-h-smith-1843', { first:'James', middle:'H.', last:'Smith', gender:'male', bDate:'1843', bPlace:null, dDate:'1913', dPlace:'Baxley, Georgia', notes:'Father of Mary Elizabeth Smith. Died 1913 in Baxley, GA.', tags:['civil-war','georgia'] });
create('mary-ann-hall-1845', { first:'Mary Ann', last:'Hall', gender:'female', bDate:'1845', bPlace:null, notes:'Mother of Mary Elizabeth Smith.', tags:['civil-war'] });

// ===== BURGESS LINE (Eugene's parents & grandparents) =====
create('benjamin-f-burgess-1845', { first:'Benjamin', middle:'F.', last:'Burgess', gender:'male', bDate:'1845', bPlace:null, dDate:'1894-12-14', dPrec:'exact', dPlace:'District of Columbia', father:'thomas-a-burgess-1795', mother:'alethia-c-burgess-1813', notes:'Father of Eugene Speiden Burgess. Died Dec 14, 1894 in DC.', tags:['civil-war','reconstruction'] });
create('lillian-l-garrison-1856', { first:'Lillian', middle:'L.', last:'Garrison', gender:'female', bDate:'1856', bPlace:null, dDate:'1956', dPlace:null, father:'william-garrison-1821', mother:'eliza-j-howdershell-1822', notes:'Mother of Eugene Speiden Burgess. Lived to 100.', tags:['reconstruction','modern'] });

// ===== RECKER LINE (Amelia's parents) =====
create('frederick-w-recker-1842', { first:'Frederick', middle:'W.', last:'Recker', gender:'male', bDate:'1842', bPlace:null, dDate:'1918-07', dPrec:'month', dPlace:'Alexandria, Virginia', father:'caspel-h-recker-1820', mother:'mary-h-recker-1820', notes:'Father of Amelia Bertha Recker. Died July 1918 in Alexandria.', tags:['civil-war','reconstruction'] });
create('amelia-m-recker-schlichting-1857', { first:'Amelia', middle:'M. R.', last:'Schlichting', gender:'female', bDate:'1857', bPlace:null, dDate:'1927-05-06', dPrec:'exact', dPlace:'Alexandria, Virginia', father:'henry-w-schlichting-1834', mother:'amelia-m-hoffgraf-1830', notes:'Mother of Amelia Bertha Recker. Died May 6, 1927 in Alexandria.', tags:['reconstruction'] });

// ===== BURGESS 3rd great-grandparents =====
create('thomas-a-burgess-1795', { first:'Thomas', middle:'A.', last:'Burgess', gender:'male', bDate:'1795', bPlace:null, dDate:'1861', dPlace:null, father:'thomas-l-burgess-1773', mother:'teresa-tyre-1777', notes:'3rd great-grandfather Burgess line.', tags:['early-republic','antebellum'] });
create('alethia-c-burgess-1813', { first:'Alethia', middle:'C.', last:'Burgess', gender:'female', bDate:'1813', bPlace:null, dDate:'1861', dPlace:null, notes:'3rd great-grandmother. Wife of Thomas A. Burgess.', tags:['antebellum'] });

// ===== GARRISON 3rd great-grandparents =====
create('william-garrison-1821', { first:'William', last:'Garrison', gender:'male', bDate:'1821', bPlace:null, dDate:'1890', dPlace:null, father:'nelson-garrison-1794', mother:'eleanor-white-1800', notes:'3rd great-grandfather Garrison line.', tags:['antebellum','civil-war'] });
create('eliza-j-howdershell-1822', { first:'Eliza', middle:'J.', last:'Howdershell', gender:'female', bDate:'1822', bPlace:null, dDate:'1912', dPlace:null, father:'john-howdershell-1789', mother:'rebecca-turner-1790', notes:'3rd great-grandmother. Wife of William Garrison. Lived to 90.', tags:['antebellum','reconstruction'] });

// ===== RECKER 3rd great-grandparents =====
create('caspel-h-recker-1820', { first:'Caspel', middle:'H.', last:'Recker', gender:'male', bDate:'1820', bPlace:null, notes:'3rd great-grandfather Recker line.', tags:['antebellum'] });
create('mary-h-recker-1820', { first:'Mary', middle:'H.', last:'Recker', gender:'female', bDate:'1820', bPlace:null, notes:'3rd great-grandmother. Wife of Caspel H. Recker.', tags:['antebellum'] });

// ===== SCHLICHTING 3rd great-grandparents =====
create('henry-w-schlichting-1834', { first:'Henry', middle:'W.', last:'Schlichting', gender:'male', bDate:'1834', bPlace:null, dDate:'1882', dPlace:null, notes:'3rd great-grandfather Schlichting line.', tags:['antebellum','civil-war'] });
create('amelia-m-hoffgraf-1830', { first:'Amelia', middle:'M.', last:'Hoffgraf', gender:'female', bDate:'1830', bPlace:null, dDate:'1901', dPlace:null, alt:['Sc'], notes:'3rd great-grandmother. Wife of Henry W. Schlichting.', tags:['antebellum','reconstruction'] });

// ===== SANDERSON 3rd great-grandparents =====
create('isaac-sanderson-sr-1800', { first:'Isaac', last:'Sanderson', gender:'male', bDate:'1800', bPlace:null, dDate:'1839', dPlace:'Duplin County, North Carolina', father:'shadrack-sanderson-1755', mother:'ann-long-1760', notes:'Father of Isaac Sanderson (1831). Died 1839 when Isaac was 8.', tags:['early-republic'] });
create('betsy-jones-1798', { first:'Betsy', last:'Jones', gender:'female', bDate:'1798', bPlace:null, notes:'Wife of Isaac Sanderson Sr (1800-1839).', tags:['early-republic'] });

// ===== KENNEDY 3rd great-grandparents =====
create('john-kennedy-1776', { first:'John', last:'Kennedy', gender:'male', bDate:'1776', bPlace:null, dDate:'1862-05-14', dPrec:'exact', dPlace:'Beulaville, Duplin County, NC', father:'william-kennedy-1734', mother:'margaret-mason-1742', notes:'Father of Sylvia A. Kennedy. Irish flag shown in Ancestry — Irish descent. Died May 14, 1862 in Beulaville.', tags:['early-republic','irish'] });
create('mary-williams-1793', { first:'Mary', last:'Williams', gender:'female', bDate:'1793', bPlace:null, dDate:'1870-04-01', dPrec:'exact', dPlace:'Duplin County, North Carolina', father:'isaac-williams-1722', mother:null, notes:'Mother of Sylvia A. Kennedy. Died April 1, 1870 in Duplin County.', tags:['early-republic'] });

// ===== 4th great-grandparents =====
create('shadrack-sanderson-1755', { first:'Shadrack', last:'Sanderson', gender:'male', bDate:'1755', bPlace:null, dDate:'1802', dPlace:null, father:'joseph-sanderson-1720', mother:'susan-george-1725', notes:'4th great-grandfather Sanderson line.', tags:['colonial','early-republic'] });
create('ann-long-1760', { first:'Ann', last:'Long', gender:'female', bDate:'1760', bPlace:null, dDate:'1805', dPlace:null, notes:'Wife of Shadrack Sanderson.', tags:['early-republic'] });
create('charles-jones-1776', { first:'Charles', last:'Jones', gender:'male', bDate:'1776', bPlace:null, notes:'Father of Betsy Jones. NC flag shown — North Carolina.', tags:['early-republic','north-carolina'] });
create('dorthea-guinn-1780', { first:'Dorthea', last:'Guinn', gender:'female', bDate:'1780', bPlace:null, dDate:'1874', dPlace:null, father:null, mother:null, notes:'Mother of Betsy Jones.', tags:['early-republic'] });
create('william-kennedy-1734', { first:'William', last:'Kennedy', gender:'male', bDate:'1734', bPlace:null, dDate:'1800', dPlace:null, father:'hugh-kennedy-1695', mother:'martha-carew-1699', notes:'4th great-grandfather Kennedy line. Irish descent.', tags:['colonial','irish'] });
create('margaret-mason-1742', { first:'Margaret', last:'Mason', gender:'female', bDate:'1742', bPlace:null, dDate:'1800', dPlace:null, notes:'Wife of William Kennedy. Both died in 1800.', tags:['colonial'] });
create('isaac-williams-1722', { first:'Isaac', last:'Williams', gender:'male', bDate:'1722', bPlace:null, dDate:'1806', dPlace:null, father:'matthew-williams-1694', mother:'abigail-nutman-1698', notes:'4th great-grandfather Williams line.', tags:['colonial'] });
create('thomas-l-burgess-1773', { first:'Thomas', middle:'L.', last:'Burgess', gender:'male', bDate:'1773', bPlace:null, dDate:'1824', dPlace:null, father:'john-burgess-1747', mother:'elizabeth-franklin-1787', notes:'4th great-grandfather Burgess line.', tags:['early-republic'] });
create('teresa-tyre-1777', { first:'Teresa', last:'Tyre', gender:'female', bDate:'1777', bPlace:null, dDate:'1860', dPlace:null, alt:['Tiar'], notes:'Wife of Thomas L. Burgess. Lived to 83.', tags:['early-republic','antebellum'] });
create('benjamin-burgess-1773', { first:'Benjamin', last:'BURGESS', gender:'male', bDate:'1773', bPlace:null, dDate:'1844', dPlace:null, notes:'4th great-grandfather. Another Burgess branch.', tags:['early-republic'] });
create('nelson-garrison-1794', { first:'Nelson', last:'Garrison', gender:'male', bDate:'1794', bPlace:null, dDate:'1874', dPlace:null, father:'john-garrison-1774', notes:'4th great-grandfather Garrison line.', tags:['early-republic','antebellum'] });
create('eleanor-white-1800', { first:'Eleanor', last:'White', gender:'female', bDate:'1800', bPlace:null, dDate:'1857', dPlace:null, notes:'Wife of Nelson Garrison.', tags:['antebellum'] });
create('john-howdershell-1789', { first:'John', last:'Howdershell', gender:'male', bDate:'1789', bPlace:null, dDate:'1864', dPlace:null, notes:'4th great-grandfather Howdershell line.', tags:['early-republic','civil-war'] });
create('rebecca-turner-1790', { first:'Rebecca', last:'Turner', gender:'female', bDate:'1790', bPlace:null, dDate:'1860', dPlace:null, father:'john-turner-1762', notes:'Wife of John Howdershell.', tags:['early-republic'] });

// ===== 5th great-grandparents =====
create('joseph-sanderson-1720', { first:'Joseph', last:'Sanderson', gender:'male', bDate:'1720', bPlace:null, dDate:'1774', dPlace:null, notes:'5th great-grandfather Sanderson line.', tags:['colonial'] });
create('susan-george-1725', { first:'Susan', last:'George', gender:'female', bDate:'1725', bPlace:null, dDate:'1803', dPlace:null, notes:'Wife of Joseph Sanderson.', tags:['colonial'] });
create('hugh-kennedy-1695', { first:'Hugh', last:'Kennedy', gender:'male', bDate:'1695', bPlace:null, dDate:'1768', dPlace:null, notes:'5th great-grandfather Kennedy line.', tags:['colonial'] });
create('martha-carew-1699', { first:'Martha', last:'Carew', gender:'female', bDate:'1699', bPlace:null, notes:'Wife of Hugh Kennedy.', tags:['colonial'] });
create('matthew-williams-1694', { first:'Matthew', last:'Williams', gender:'male', bDate:'1694', bPlace:null, dDate:'1772', dPlace:null, notes:'5th great-grandfather Williams line.', tags:['colonial'] });
create('abigail-nutman-1698', { first:'Abigail', last:'Nutman', gender:'female', bDate:'1698', bPlace:null, dDate:'1771', dPlace:null, notes:'Wife of Matthew Williams.', tags:['colonial'] });
create('john-garrison-1774', { first:'John', last:'Garrison', gender:'male', bDate:'1774', bPlace:null, dDate:'1874', dPlace:null, father:null, notes:'Father of Nelson Garrison. Lived to 100.', tags:['early-republic'] });
create('john-turner-1762', { first:'John', last:'Turner', gender:'male', bDate:'1762', bPlace:null, dDate:'1816', dPlace:null, notes:'Father of Rebecca Turner.', tags:['colonial','early-republic'] });
create('thomas-sanderson-1750', { first:'Thomas', last:'Sanderson', gender:'male', bDate:'1750', bPlace:null, notes:'Father of Shadrack? Or sibling line.', tags:['colonial'] });

// ===== BURGESS deep line (Screenshot 3) =====
create('john-burgess-1747', { first:'John', last:'Burgess', gender:'male', bDate:'1747', bPlace:null, dDate:'1774', dPlace:null, father:'samuel-burgess-1706', mother:'elizabeth-gorley-1690', notes:'Father of Thomas L. Burgess.', tags:['colonial'] });
create('elizabeth-franklin-1787', { first:'Elizabeth', last:'Franklin', gender:'female', bDate:null, bPrec:'unknown', dDate:'1787', dPlace:null, father:'robert-franklin-1720', mother:'priscilla-boucher-1715', notes:'Wife of John Burgess. Death 1787.', tags:['colonial'] });
create('william-tyre-1783', { first:'William', last:'Tyre', gender:'male', bDate:null, bPrec:'unknown', dDate:'1783', dPlace:null, alt:['Tiar'], notes:'Father of Teresa Tyre.', tags:['colonial'] });
create('john-burgess-1777', { first:'John', last:'Burgess', gender:'male', bDate:null, bPrec:'unknown', dDate:'1777', dPlace:null, notes:'Another Burgess — possibly different branch.', tags:['colonial'] });
create('mary-haislip-1745', { first:'Mary', last:'Haislip', gender:'female', bDate:'1745', bPlace:null, notes:'Wife of John Burgess (-1777).', tags:['colonial'] });

// ===== BURGESS deepest (Screenshot 3 top) =====
create('samuel-burgess-1706', { first:'Samuel', last:'BURGESS', gender:'male', bDate:'1706', bPlace:null, dDate:'1746', dPlace:null, father:'benjamin-burgess-1685', mother:'ann-unknown-1690', notes:'Son of Benjamin Burgess (1685). Father of John Burgess (1747).', tags:['colonial'] });
create('elizabeth-gorley-1690', { first:'Elizabeth', last:'Gorley', gender:'female', bDate:'1690', bPlace:null, dDate:'1750', dPlace:null, father:'thomas-gorley-1686', mother:null, notes:'Wife of Samuel Burgess.', tags:['colonial'] });
create('robert-franklin-1720', { first:'Robert', last:'FRANKLIN', gender:'male', bDate:'1720', bPlace:null, dDate:'1760', dPlace:null, father:'john-franklin-1672', mother:'mary-lloyd-1675', notes:'Father of Elizabeth Franklin.', tags:['colonial'] });
create('priscilla-boucher-1715', { first:'Priscilla', last:'BOUCHER', gender:'female', bDate:'1715', bPlace:null, dDate:'1796', dPlace:null, father:'francis-boucher-1693', mother:'elizabeth-milstead-1705', notes:'Mother of Elizabeth Franklin. Lived to 81.', tags:['colonial'] });
create('thomas-gorley-1686', { first:'Thomas', last:'Gorley', gender:'male', bDate:'1686', bPlace:null, dDate:'1720', dPlace:null, notes:'Father of Elizabeth Gorley.', tags:['colonial'] });
create('john-gorley-1693', { first:'John', last:'Gorley', gender:'male', bDate:'1693', bPlace:null, dDate:'1728', dPlace:null, notes:'Related to Thomas Gorley.', tags:['colonial'] });

// ===== BURGESS deepest ancestor =====
create('benjamin-burgess-1685', { first:'Benjamin', last:'BURGESS', gender:'male', bDate:'1685', bPlace:null, dDate:'1742', dPlace:null, notes:'Earliest known Burgess ancestor. Born 1685.', tags:['colonial'] });
create('ann-unknown-1690', { first:'Ann', last:'UNKNOWN', gender:'female', bDate:'1690', bPlace:null, notes:'Wife of Benjamin Burgess (1685).', tags:['colonial'] });

// ===== FRANKLIN deepest =====
create('john-franklin-1672', { first:'John', last:'FRANKLIN', gender:'male', bDate:'1672', bPlace:null, dDate:'1760', dPlace:null, notes:'Father of Robert Franklin. Lived to 88.', tags:['colonial'] });
create('mary-lloyd-1675', { first:'Mary', last:'Lloyd', gender:'female', bDate:'1675', bPlace:null, dDate:'1772', dPlace:null, notes:'Wife of John Franklin. Lived to 97.', tags:['colonial'] });
create('francis-boucher-1693', { first:'Francis', last:'Boucher', gender:'male', bDate:'1693', bPlace:null, dDate:'1728', dPlace:null, notes:'Father of Priscilla Boucher.', tags:['colonial'] });
create('elizabeth-milstead-1705', { first:'Elizabeth', last:'Milstead', gender:'female', bDate:'1705', bPlace:null, dDate:'1731', dPlace:null, notes:'Mother of Priscilla Boucher. Died young at 26.', tags:['colonial'] });

// ===== 5th great-grandparent additional from Screenshot 2 =====
create('william-white-1778', { first:'William', last:'White', gender:'male', bDate:'1778', bPlace:null, dDate:'1820', dPlace:null, notes:'Father of Eleanor White (wife of Nelson Garrison).', tags:['early-republic'] });
create('lydia-mcdonald-1780', { first:'Lydia', last:'McDonald', gender:'female', bDate:'1780', bPlace:null, dDate:'1802', dPlace:null, notes:'Mother of Eleanor White. Died young at 22.', tags:['early-republic'] });
create('jacob-howdershell', { first:'Jacob', last:'Howdershell', gender:'male', bDate:'1758', bPlace:null, dDate:'1809', dPlace:null, notes:'Father of John Howdershell.', tags:['colonial','early-republic'] });
create('elizabeth-garrison-1769', { first:'Elizabeth', last:'Garrison', gender:'female', bDate:'1769', bPlace:null, dDate:'1858', dPlace:null, notes:'Related to Garrison line. Lived to 89.', tags:['early-republic'] });
create('nancy-garrison-1772', { first:'Nancy', last:'Garrison', gender:'female', bDate:'1772', bPlace:null, notes:'Wife of John Garrison (1774).', tags:['early-republic'] });
create('william-turner-1786', { first:'William', last:'Turner', gender:'male', bDate:'1786', bPlace:null, dDate:'1838', dPlace:null, notes:'Brother/relative of Rebecca Turner.', tags:['early-republic'] });

// ===== Screenshot 4 — deepest Sanderson/Kennedy/Williams =====
create('william-guinn', { first:'William', last:'Guinn', gender:'male', bDate:null, bPrec:'unknown', notes:'Father of Dorthea Guinn. With Elizabeth Hill.', tags:['colonial'] });
create('elizabeth-hill-1754', { first:'Elizabeth', last:'Hill', gender:'female', bDate:'1754', bPlace:null, notes:'Mother of Dorthea Guinn.', tags:['colonial'] });
create('frederick-j-arnold-1739', { first:'Frederick', middle:'J.', last:'Arnold', gender:'male', bDate:'1739', bPlace:null, dDate:'1812', dPlace:null, notes:'Related to Susanna Arnold line.', tags:['colonial','early-republic'] });
create('susan-eve-rebly-snide-1750', { first:'Susan Eve', last:'Rebly Snide', gender:'female', bDate:'1750', bPlace:null, notes:'Related to Arnold line.', tags:['colonial'] });
create('pricilla-merrill-1764', { first:'Pricilla', last:'Merrill', gender:'female', bDate:'1764', bPlace:null, dDate:'1846', dPlace:null, notes:'Wife of Shadrack Sanderson or related.', tags:['early-republic'] });
create('susanna-arnold-1776', { first:'Susanna', last:'Arnold', gender:'female', bDate:'1776', bPlace:null, dDate:'1861', dPlace:null, notes:'Related to Arnold line.', tags:['early-republic'] });

console.log('\nDone!');
