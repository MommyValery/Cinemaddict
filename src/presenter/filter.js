import SiteMenuView from "../view/menu.js";
import { remove, render, RenderPosition, replace } from "../utils/render.js";
import { FilterMode, UpdateType, MenuItem } from "../const.js";
import { filter } from "../utils/filter.js";

export default class Filter {
  constructor(container, filterModel, filmsModel, movieListPresenter) {
    this._container = container;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._movieListPresenter = movieListPresenter;

    this._filterComponent = null;
    
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleMenuClick = this._handleMenuClick.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);

  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
  
    this._filterComponent = new SiteMenuView(filters, this._filterModel.getFilter());
    this._filterComponent.setMenuClickHandler(this._handleMenuClick);
  
    if (prevFilterComponent === null) {
      render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }
  
    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.STATS:
        this._movieListPresenter.destroy();
        this._movieListPresenter.showStatistics();
        break;
      case MenuItem.ALL_MOVIES:
        this._movieListPresenter.hideStatistics();
        this._movieListPresenter.destroy();
        this._filterModel.setFilter(UpdateType.MAJOR, menuItem);
        this._movieListPresenter.init();
        break;
      case MenuItem.FAVORITES:
        this._movieListPresenter.hideStatistics();
        this._movieListPresenter.destroy();
        this._filterModel.setFilter(UpdateType.MAJOR, menuItem);
        this._movieListPresenter.init();
        break;
      case MenuItem.HISTORY:
        this._movieListPresenter.hideStatistics();
        this._movieListPresenter.destroy();
        this._filterModel.setFilter(UpdateType.MAJOR, menuItem);
        this._movieListPresenter.init();
        break;
      case MenuItem.WATCHLIST:
        this._movieListPresenter.hideStatistics();
        this._movieListPresenter.destroy();
        this._filterModel.setFilter(UpdateType.MAJOR, menuItem);
        this._movieListPresenter.init();
        break;
    }
  }
        
  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterMode.ALL,
        name: 'All movies',
        count: filter[FilterMode.ALL](films).length,
      },
      {
        type: FilterMode.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterMode.WATCHLIST](films).length,
      },
      {
        type: FilterMode.HISTORY,
        name: 'History',
        count: filter[FilterMode.HISTORY](films).length,
      },
      {
        type: FilterMode.FAVORITES,
        name: 'Favorites',
        count: filter[FilterMode.FAVORITES](films).length,
      },
    ];
  };
}