import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = 'Pokemon';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '', moduleId: PLATFORM.moduleName('no-selection'), nav: true, title: 'Select' },
      { route: 'board/', moduleId: PLATFORM.moduleName('components/board/board'), name: 'board', title: 'PICK ONE!' }
    ]);

    this.router = router;
  }
}
