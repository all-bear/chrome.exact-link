import {Settings} from './../../../bower_components/chrome-lib-settings/dist/js/settings';

const HIGHLIGHT_CSS_CLASS = 'exact-link__element-highlight';

export class Highlighter {
  static highlight(target) {
    Settings.load(settings => {
      if (!settings.highlight) {
        return;
      }

      const highlightAnimate = document.createElement('div');

      highlightAnimate.classList.add(HIGHLIGHT_CSS_CLASS);

      target.parentElement.insertBefore(highlightAnimate, target);
    });
  }
}