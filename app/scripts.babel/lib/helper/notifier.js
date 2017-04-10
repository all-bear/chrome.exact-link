import {Settings} from './../../../bower_components/chrome-lib-settings/dist/js/settings';

const humane = require('../../../bower_components/humane-js/humane.min')

export class Notifier {
  static notify(msg) {
    Settings.load(settings => {
      if (!settings.notifications) {
        return;
      }

      humane.log(msg);
    });
  }
}