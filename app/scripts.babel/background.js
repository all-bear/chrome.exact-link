import {MESSAGES} from './lib/constants/messages'

chrome.contextMenus.create({
    title: chrome.i18n.getMessage('menuTitle'),
    contexts: ['all'],
    documentUrlPatterns: ['<all_urls>'],
    id: 'exact-link'
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.sendMessage(tab.id, {message: MESSAGES.generate_exact_link_to_el});
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, {message: MESSAGES.generate_exact_link_to_state});
});
