import {Settings} from './../../../bower_components/chrome-lib-settings/dist/js/settings';
import {Highlighter} from './highlighter';

const smoothScroll = require('../../../bower_components/smooth-scroll/dist/js/smooth-scroll.min');

export class Scroller {
  static scrollTo(target, options = {}) {
    Settings.load(settings => {
      smoothScroll.animateScroll(target, null, {
        callback: () => {
            Highlighter.highlight(target);
        },
        offset: options.skipTopOffset ? 0 : settings.topOffset
      });
    });
  }
}