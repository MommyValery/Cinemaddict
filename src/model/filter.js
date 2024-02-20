import Observer from '../utils/observer';
import { FilterMode } from '../const';

class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterMode.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}

export { Filter as default };