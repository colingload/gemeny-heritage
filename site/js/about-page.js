/**
 * Gemeny Heritage — About Page
 */

const AboutPage = {
  render(container) {
    container.innerHTML = `
      <section class="page-header">
        <h1>About This Project</h1>
      </section>
      <div class="about-content prose">
        <p>
          This project preserves and shares nearly 300 years of the Gemeny family heritage — from
          Anthony Gemini's arrival in North America circa 1755 through ten generations of family history.
        </p>
        <p>
          Every Gemeny in this country descends from John "The Sea Captain" Gemeny, son of Anthony Gemini
          and Katherine Richards, married in Salem, Massachusetts in 1756.
        </p>

        <h2>Credits</h2>
        <dl class="credits-list">
          <dt>Steven Evans Gemeny</dt>
          <dd>Original site creator, genealogical researcher, audio preservationist. Created and maintained
          gemeny.com since the late 1990s. Digitized Andrew Gemeny's oral history recordings in 2007-2008.</dd>

          <dt>W. Gordon Gemeny</dt>
          <dd>Historical researcher. Author of the Thomas Gemini origin essay (2002) exploring the family's
          possible connection to Thomas Gemini of Louvain.</dd>

          <dt>Mary Gemeny (1836–1937)</dt>
          <dd>Author of "A Reminiscence of the War of the Rebellion" (1913), a firsthand account of her
          husband Benjamin's imprisonment as a Union sympathizer during the Civil War.</dd>

          <dt>Andrew Gemeny (1896–1989)</dt>
          <dd>Family storyteller. Recorded oral histories from the 1970s preserving firsthand accounts
          of early 20th century family life.</dd>
        </dl>

        <h2>Contributing</h2>
        <p>
          Family data lives in structured JSON files and Markdown content files. If you have corrections,
          additions, photos, or stories to contribute, please reach out or submit a pull request.
        </p>

        <h2>Technology</h2>
        <p>
          Plain HTML, CSS, and JavaScript. No framework, no build step. Data stored as JSON and Markdown
          flat files. Designed to be simple, fast, and maintainable for decades.
        </p>

        <p class="about-copyright">
          <em>Audio recordings copyright 2008 Steven E. Gemeny. War memoir copyright 1997 Steven E. Gemeny.
          Licensed for personal use only.</em>
        </p>
      </div>
    `;
  }
};
