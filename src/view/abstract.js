import {returnElement} from '../utils/render.js'

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t initiate Abstract, only concrete one.')
    }
    this._element = null;
    this._callback = {};
  }
  
  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }
  
  getElement() {
    if (!this._element) {
    this._element = returnElement(this.getTemplate());
    }
    return this._element;
  }
  
  removeElement() {
    this._element = null;
  }
  
  show() {
    this._element.classList.remove('visually-hidden');
  }

  hide() {
    this._element.classList.add('visually-hidden');
  }

}
  