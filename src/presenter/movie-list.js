
import FilmSectionView from '../view/films-section.js';
import MainFilmListView from '../view/main-films-list.js';
import ButtonShowView from '../view/button-show.js';
import NoFilmsView from '../view/no-films.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { filter } from '../utils/filter.js';
import MoviePresenter from './movie.js';
import SortView from '../view/sort.js';
import { SortType, UserAction, UpdateType } from '../const.js';
import { sortFilmDateDown, sortFilmRatingDown } from '../utils/card.js';
import StatisticsView from '../view/statistics.js';
import LoadingView from '../view/loading.js';

// сортировка при тыке на дефолт ничего не возращает
// статс при переключении на today


const FILMS_COUNT = 20;
const FILMS_COUNTER_PER_STEP = 5;


export default class MovieList {
  constructor(mainContainer, filmsModel, filterModel, api) {
    this._mainContainer = mainContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._moviePresenter = {};
    this._showMoreButton = null;
    this._sortComponent = null;
    this._statsComponent = null;
    this._renderedFilmCount = FILMS_COUNTER_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    
    this._filmsSectionComponent = new FilmSectionView();
    this._filmListComponent = new MainFilmListView();
    this._noCardsComponent = new NoFilmsView();
    this._loadingComponent = new LoadingView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

  }
  
  init() {
    render(this._mainContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent, this._filmListComponent, RenderPosition.BEFOREEND);
    
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderList();
  }

  destroy() {
    this._clearFilmsList({ resetRenderedTaskCount: true, resetSortType: true });

    remove(this._filmListComponent);
    remove(this._filmsSectionComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  showStatistics() {
    this._statsComponent = new StatisticsView(this._filmsModel.getFilms());
    render(this._mainContainer, this._statsComponent, RenderPosition.BEFOREEND);
    this._statsComponent.show();
  }

  hideStatistics() {
    if (this._statsComponent) {
      this._statsComponent.hide();
      remove(this._statsComponent);
      this._statsComponent = null;
    }
  }


  _getFilms() {
    const films = this._filmsModel.getFilms();
    const filterType = this._filterModel.getFilter();
    const filteredFilms = filter[filterType](films);
    switch (this._currentSortType) {
      case SortType.DATE_DOWN:
        return filteredFilms.sort(sortFilmDateDown);
      case SortType.RATING_DOWN:
        return filteredFilms.sort(sortFilmRatingDown);
      case SortType.DEFAULT:
        return filteredFilms;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
        })
        break;    
    }
  }
  
  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._moviePresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearFilmsList();
        this._renderList();
        break;
        case UpdateType.MAJOR:
        this._clearFilmsList({resetRenderedFilmsCount: true, resetSortType: true});
        break;
        case UpdateType.INIT:
          this._isLoading = false;
          remove(this._loadingComponent);
          this._renderList();
          break;
    }
  }

  _handleModeChange() {
       Object
         .values(this._moviePresenter)
         .forEach((presenter) => presenter.resetView())
  }
  
  _handleSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._clearFilmsList({resetRenderedFilmsCount:true});
    this._renderList();
  }
  
  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.sortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmListComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._filmsSectionComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }


  _renderFilm(film, container = this._filmListComponent) {
    const moviePresenter = new MoviePresenter(container, this._handleViewAction,
      this._handleModeChange, this._api);
    moviePresenter.init(film);
    if (container === this._filmListComponent) {
      this._moviePresenter[film.id] = moviePresenter;
    }
  
  }

    
_renderFilms(films) {  
    films.forEach((film) => this._renderFilm(film));
  };
  
_renderNoCards() {
        render(this._filmsSectionComponent, this._noCardsComponent, RenderPosition.AFTERBEGIN);
}
    
_handleShowMoreButtonClick() {
  const filmCount = this._getFilms().length;

  const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILMS_COUNTER_PER_STEP);
  const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

  this._renderFilms(films);
  this._renderedFilmCount = newRenderedFilmCount;

  if (this._renderedFilmCount >= filmCount) {
    remove(this._showMoreButton);
    }
 }

  _renderShowMoreButton() {
    if (this._showMoreButton !== null) {
      this._showMoreButton = null;
    }

    this._showMoreButton = new ButtonShowView();
  render(this._filmListComponent, this._showMoreButton, RenderPosition.BEFOREEND);   
    this._showMoreButton.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    
    const films = this._getFilms();
    const filmCount = films.length;
    
    if (filmCount === 0) {
      this._renderNoCards();
      return;
    }

    this._renderSort();
    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));
  
    if (filmCount > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }     
  }

  _clearFilmsList({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
      this._moviePresenter = {};
      remove(this._showMoreButton);
      remove(this._noCardsComponent);
    remove(this._sortComponent);
    remove(this._loadingComponent);
    if (resetRenderedFilmsCount) {
      this._renderedFilmCount = FILMS_COUNTER_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount)
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

}
