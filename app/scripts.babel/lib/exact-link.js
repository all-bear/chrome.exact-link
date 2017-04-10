import {Scroller} from './helper/scroller';
import {Target, UnableToFindElementException} from './helper/target';
import {Encoder} from './helper/encoder';
import {Notifier} from './helper/notifier';
import {Clipboard, UnableToCopyException} from './helper/clipboard';
import {MESSAGES} from './constants/messages';

const target = new Target();
export class ExactLink {
  static handleRequest() {
    const request = Encoder.decode(location);

    if (!request) {
      return false;
    }

    if (request.selector) {
      Target.getBySelector(request.selector)
        .then(target => {
          Scroller.scrollTo(target, {
            skipTopOffset: request.skipTopOffset
          });
        })
        .catch(reason => {
          if (reason === MESSAGES.ui.unable_to_find_target_el) {
            Notifier.notify(MESSAGES.ui.unable_to_find_target_el);
          } else {
            throw new Error(reason);
          }
        });
    }
  }

  static handleGenerateToElement(element, options) {
    try {
      element.then(selector => {
        try {
          Clipboard.copy(Encoder.encode(location, selector, options));

          Notifier.notify(MESSAGES.ui.create_success);
        } catch (e) {
          if (e instanceof UnableToCopyException) {
            Notifier.notify(MESSAGES.ui.unable_to_copy);
          } else {
            throw e;
          }
        }
      });
    } catch (e) {
      if (e instanceof UnableToFindElementException) {
        Notifier.notify(MESSAGES.ui.unable_to_find_target_el);
      } else {
        throw e;
      }
    }
  }

  static handleGenerateToElementAction() {
    this.handleGenerateToElement(target.hoverSelector)
  }

  static handleGenerateToStateAction() {
    this.handleGenerateToElement(target.topSelector, {skipTopOffset: true})
  }
}