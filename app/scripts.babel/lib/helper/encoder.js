const APP_KEY = 'exact-link';
const SELECTOR_KEY = 'el-select';
const SKIP_TOP_KEY = 'el-select-skip-top';
const ID_SELECTOR_REGEXP = /^#[a-zA-Z0-9\-]*$/;

export class Encoder {
  static isIdSelector(selector) {
    return ID_SELECTOR_REGEXP.test(selector);
  }

  static encode(location, selector, options = {}) {
    const url = new URL(location.toString());
    const searchObj = this._parseLocationSearch(location.search);

    if (this.isIdSelector(selector) && !location.hash) {
      url.hash = selector;
    } else {
      searchObj[SELECTOR_KEY] = selector;
    }

    searchObj[APP_KEY] = 1;
    searchObj[SKIP_TOP_KEY] = options.skipTopOffset;

    url.search = this._stringifyLocationSearch(searchObj);
    return url.toString();
  }

  static _parseLocationSearch(search) {
    const normalized = decodeURIComponent(search).replace(/^\?/, '');
    const parts = normalized.split('&');

    return parts.reduce((basket, part) => {
      const [key, val] = part.split('=');

      if (key && val) {
        basket[key] = val;
      }

      return basket;
    }, {})
  }

  static _stringifyLocationSearch(search) {
    var pairs = [];

    if (!Object.keys(search).length) {
      return '';
    }

    for (var key in search) {
      let value = search[key];

      if (key && value) {
        pairs.push(`${key}=${value}`);
      }
    }

    return `?${pairs.join('&')}`;
  }

  static decode(location) {
    const search = this._parseLocationSearch(location.search);

    if (!search[APP_KEY]) {
      return false;
    }

    return {
      selector: search[SELECTOR_KEY] || location.hash || false,
      skipTopOffset: search[SKIP_TOP_KEY]
    }
  }
}