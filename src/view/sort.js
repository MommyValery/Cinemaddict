import Abstract from "./abstract.js";
import { SortType } from "../const.js";



const createSortTemplate = (currentSortType) => {
  return `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button ${currentSortType === SortType.DEFAULT? 'sort__button--active' : ''} ">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE_DOWN}" class="sort__button ${currentSortType === SortType.DATE_UP || currentSortType === SortType.DATE_DOWN ? 'sort__button--active' : ''}">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING_DOWN}" class="sort__button  ${currentSortType === SortType.RATING_UP || currentSortType === SortType.RATING_DOWN ? 'sort__button--active' : ''}">Sort by rating</a></li>
  </ul>`;
}

export default class Sort extends Abstract {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }


  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  sortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler)
  }
}