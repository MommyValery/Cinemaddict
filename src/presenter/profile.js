import { render, RenderPosition, replace, remove } from "../utils/render";
import ProfileView from "../view/profile";

export default class ProfilePresenter {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._profileComponent = null;
    this._watchedFilms = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._getScore();
    const prevProfileComponent = this._profileComponent;
    this._profileComponent = new ProfileView(this._watchedFilms.length);
  
    if (prevProfileComponent === null) {
      render(this._container, this._profileComponent, RenderPosition.BEFOREEND);
      return;
    }
  
    replace(this._profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  
  _getScore() {
    const films = this._filmsModel.getFilms();
    this._watchedFilms = films.filter(({ userDetails: { isWatched } }) => isWatched);
  }
}