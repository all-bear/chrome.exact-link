'use strict';

import {ExactLink} from './lib/exact-link';
import {MESSAGES} from './lib/constants/messages';
import {DEFAULTS} from './lib/constants/defaults';
import {Settings} from './../bower_components/chrome-lib-settings/dist/js/settings';

Settings.defaults = DEFAULTS;

chrome.runtime.onMessage.addListener(request => {
    if (request.message === MESSAGES.generate_exact_link_to_el) {
      ExactLink.handleGenerateToElementAction();
    }

    if (request.message === MESSAGES.generate_exact_link_to_state) {
      ExactLink.handleGenerateToStateAction();
    }
});

ExactLink.handleRequest();