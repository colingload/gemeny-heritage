/**
 * Gemeny Heritage — Hash Router
 *
 * Simple client-side router using hash fragments.
 * Routes: #/ (home), #/tree, #/timeline, #/person/{id}, #/stories, #/artifacts, #/about
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this._onHashChange = this._onHashChange.bind(this);
  }

  /** Register a route handler. Pattern can include :param placeholders. */
  on(pattern, handler) {
    this.routes[pattern] = {
      handler,
      regex: this._patternToRegex(pattern),
      paramNames: this._extractParamNames(pattern)
    };
    return this;
  }

  /** Start listening for hash changes. */
  start() {
    window.addEventListener('hashchange', this._onHashChange);
    this._onHashChange();
  }

  /** Stop listening. */
  stop() {
    window.removeEventListener('hashchange', this._onHashChange);
  }

  /** Navigate to a route programmatically. */
  navigate(hash) {
    window.location.hash = hash;
  }

  _onHashChange() {
    const hash = window.location.hash || '#/';
    const path = hash.startsWith('#') ? hash.slice(1) : hash;

    for (const [pattern, route] of Object.entries(this.routes)) {
      const match = path.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = decodeURIComponent(match[i + 1]);
        });
        this.currentRoute = { pattern, params, path };
        route.handler(params);
        return;
      }
    }

    // No match — go home
    if (path !== '/') {
      this.navigate('#/');
    }
  }

  _patternToRegex(pattern) {
    const escaped = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\:(\w+)/g, '([^/]+)');
    return new RegExp(`^${escaped}$`);
  }

  _extractParamNames(pattern) {
    const names = [];
    const re = /:(\w+)/g;
    let match;
    while ((match = re.exec(pattern)) !== null) {
      names.push(match[1]);
    }
    return names;
  }
}
