export default class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(callback) {
    this._observers.push(callback);
  }

  removeObserver(callback) {
    this._observers.filter((existedCallback) => existedCallback !== callback);
  }

  _notify(event, payload) {
    this._observers.forEach((callback) => callback(event, payload));
  }
}