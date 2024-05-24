import Abstract from "./abstract.js";
import Smart from "./smart.js";
import { convertMinutesToHours, humanizeDate } from "../utils/card.js";

const getShortDescription = (text) => {
  if (text.length > 140) {
    return text.slice(0, 141) + '...';
  }
  return text;
}

const createFilmCardTemplate = (film) => {
  const { comments,
    filmInfo: { title, alternativeTitle, rating, release, description, genre, poster, runtime },
    userDetails: { isFavorite, inWatchlist, isWatched }
  } = film;
  const genres = genre.join(', ');
  const filmDuration = convertMinutesToHours(runtime).hours + 'h ' + convertMinutesToHours(runtime).minutes + 'm';
  const buttonActiveClass = (type) => {
    if (type) {
      return 'film-card__controls-item--active';
    } else {
      return '';
    }
  }
  
return `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${humanizeDate(release.date, 'YYYY')}</span>
            <span class="film-card__duration">${filmDuration}</span>
            <span class="film-card__genre">${genres}</span>
          </p>
          <img src="${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${getShortDescription(description)}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${buttonActiveClass(inWatchlist)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${buttonActiveClass(isWatched)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${buttonActiveClass(isFavorite)}" type="button">Mark as favorite</button>
          </div>
        </article>`
}

export default class Card extends Smart {
  constructor(film) {
    super();
    this._film = film;
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._setFavoriteHandler = this._setFavoriteHandler.bind(this);
    this._setWatchedHandler = this._setWatchedHandler.bind(this);
    this._setWatchlistHandler = this._setWatchlistHandler.bind(this);
  }
  
  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _openPopupHandler(evt) {
    evt.preventDefault();
    this._callback.cardClick();
  }

  setOpenPopupHandler(callback) {
    this._callback.cardClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openPopupHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openPopupHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openPopupHandler);    
  }


  _setWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setWatchlistHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this._setWatchlistHandler);
  }

  _setWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setWatchedHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._setWatchedHandler); 
  }
  
  _setFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._setFavoriteHandler); 
  }
  
}