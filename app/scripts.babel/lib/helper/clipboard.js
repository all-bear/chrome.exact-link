export class Clipboard {
  static init() {
    if (this.inited) {
      return;
    }

    document.addEventListener('copy', e => {
      if (this.intercept) {
        this.intercept = false;
        e.clipboardData.setData('text/plain', this.msg);
        e.preventDefault();
      }
    });

    this.inited = true;
  }

  static copy(msg) {
    this.init();

    return new Promise((resolve, reject) => {
      this.intercept = true; // Race condition?
      this.msg = msg;
      try {
        if (document.execCommand('copy')) {
          // document.execCommand is synchronous: http://www.w3.org/TR/2015/WD-clipboard-apis-20150421/#integration-with-rich-text-editing-apis
          // So we can call resolve() back here.
          resolve();
        } else {
          this.intercept = false;
          reject(new UnableToCopyException('Can\'t eval exec command'));
        }
      } catch (e) {
        this.intercept = false;
        reject(e);
      }
    });
  }
}

export class UnableToCopyException extends Error {}