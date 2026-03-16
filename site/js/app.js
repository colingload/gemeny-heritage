/**
 * Gemeny Heritage — App Controller
 *
 * Initializes the application: sets up data loader, router, and page renderers.
 * Each page module exposes a render(container, params, dataLoader) function.
 */

(function () {
  const DATA_PATH = '../data';
  const loader = new DataLoader(DATA_PATH);
  const router = new Router();

  const $main = document.getElementById('app-main');

  /** Clear the main content area and return it for rendering. */
  function clearMain() {
    $main.innerHTML = '';
    window.scrollTo(0, 0);
    return $main;
  }

  /** Update active nav link. */
  function setActiveNav(path) {
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('nav-active', href === '#' + path || href === '#/' + path);
    });
  }

  // -- Routes --

  router.on('/', () => {
    setActiveNav('/');
    HomePage.render(clearMain(), loader);
  });

  router.on('/tree', () => {
    setActiveNav('/tree');
    TreePage.render(clearMain(), loader);
  });

  router.on('/timeline', () => {
    setActiveNav('/timeline');
    TimelinePage.render(clearMain(), loader);
  });

  router.on('/person/:id', (params) => {
    setActiveNav('/person');
    PersonPage.render(clearMain(), params.id, loader);
  });

  router.on('/stories', () => {
    setActiveNav('/stories');
    StoriesPage.render(clearMain(), loader);
  });

  router.on('/artifacts', () => {
    setActiveNav('/artifacts');
    ArtifactsPage.render(clearMain(), loader);
  });

  router.on('/about', () => {
    setActiveNav('/about');
    AboutPage.render(clearMain(), loader);
  });

  router.on('/search', () => {
    setActiveNav('/search');
    SearchPage.render(clearMain(), loader);
  });

  // -- Initialize --

  loader.loadIndexes().then(() => {
    router.start();
  });
})();
