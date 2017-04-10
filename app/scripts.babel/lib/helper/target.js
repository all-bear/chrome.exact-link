import {Settings} from './../../../bower_components/chrome-lib-settings/dist/js/settings';
import {MESSAGES} from '../constants/messages';

const CssSelectorGenerator = require('../../../bower_components/css-selector-generator/build/css-selector-generator.min').CssSelectorGenerator;

export class Target {
  constructor() {
    document.addEventListener('mousedown', e => {
      if (e.button === 2) {
        this._element = event.target;
      }
    });
    this.generator = new CssSelectorGenerator();
  }

  get hoverElement() {
    if (!this._element) {
      throw new UnableToFindElementException();
    }

    return this._element;
  }

  getAllParents(element) {
    const parents = [];
    let parent = element.parentNode;

    while (parent) {
      parents.push(parent);
      parent = parent.parentNode;
    }

    return parents;
  }

  get topElement() {
    return new Promise((resolve) => {
      Settings.load(settings => {
        let nodes = [];

        this.getElementInSquare(
          [
            0,
            0
          ],
          [
            window.innerWidth,
            settings.findOffset
          ],
          0,
          (element) => {
            nodes.push(element);
            return false;
          },
          false
        );

        resolve(nodes.sort((a, b) => Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top))[0]);
      })
    });
  }

  isElementFullInSquare(leftPoint, rightPoint, element) {
    const elementArea = element.getBoundingClientRect();

    return leftPoint[1] <= elementArea.top &&
      elementArea.top + elementArea.height <= rightPoint[1];
  }

  getElementInSquare(leftPoint, rightPoint, offset, findCb, fullIn = true, accuracy = 10) {
    let [minX, minY] = [leftPoint[0], leftPoint[1] - offset];
    let [maxX, maxY] = [rightPoint[0], rightPoint[1]];
    let [x, y] = [minX, minY];

    while ((x+=accuracy) <= maxX) {
      y = 0;
      while ((y+=accuracy) <= maxY) {
        let element = document.elementFromPoint(x, y);
        if (element && (!findCb || findCb(element)) && (!fullIn || this.isElementFullInSquare([minX, minY], [maxX, maxY], element))) {
          return element;
        }
      }
    }

    return null;
  }

  getClosestElementWithDomId(element) {
    return new Promise((resolve) => {
      Settings.load(settings => {
        const elementArea = element.getBoundingClientRect();

        resolve(this.getElementInSquare(
          [
            elementArea.left,
            elementArea.top
          ],
          [
            elementArea.left + elementArea.width,
            elementArea.top + elementArea.height
          ],
          settings.findOffset,
          (element) => element.id
        ));
      });
    });
  }

  getSelectorFor(element) {
    return new Promise(resolve => {
      this.getClosestElementWithDomId(element).then((domIdElement) => {
        if (domIdElement) {
          return resolve(`#${domIdElement.id}`);
        }

        resolve(this.generator.getSelector(element));
      });
    });
  }

  get hoverSelector() {
    return this.getSelectorFor(this.hoverElement)
  }

  get topSelector() {
    return new Promise(resolve => {
      this.topElement.then(element => {
        resolve(this.getSelectorFor(element));
      });
    });
  }

  static getBySelector(selector) {
    return new Promise((resolve, reject) => {
      Settings.load(settings => {
        const action = (attemptI) => {
          if (!attemptI) {
            reject(MESSAGES.ui.unable_to_find_target_el);
          }

          const target = document.querySelector(selector);

          if (!target) {
            return setTimeout(() => {
              action(attemptI - 1);
            }, settings.loadAttemptInterval);
          }

          setTimeout(() => {
            resolve(target);
          }, parseInt(settings.loadDelay));
        };

        action(settings.loadAttemptMaxCount);
      });
    });
  }
}

export class UnableToFindElementException extends Error {}