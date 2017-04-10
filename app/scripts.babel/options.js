import {Settings} from './../bower_components/chrome-lib-settings/dist/js/settings';
import {SettingsUI} from './../bower_components/chrome-lib-settings/dist/js/settings-ui';
import {InlineI18n} from '../bower_components/chrome-lib-inline-i18n/dist/js/i18n';
import {DEFAULTS} from './lib/constants/defaults';

Settings.defaults = DEFAULTS;

SettingsUI.init();
InlineI18n.render();