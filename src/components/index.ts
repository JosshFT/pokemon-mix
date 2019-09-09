import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('./items/item'),
    PLATFORM.moduleName('./tree/tree'),
    PLATFORM.moduleName('./board/board'),
  ])
}
