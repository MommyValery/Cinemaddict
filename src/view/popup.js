import { render, RenderPosition } from '../utils/render.js';
import Abstract from './abstract.js';
import Smart from './smart.js';
import he from 'he';
import { humanizeDate, convertMinutesToHours } from '../utils/card.js';
import dayjs from 'dayjs';
import { ErrorMessage } from '../const.js';

const createCommentsTemplate = (filmComments) => {
  let template = '';
  filmComments.forEach(({ author, comment, date, emotion, id }) => {
  template += `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
  <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
  </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${humanizeDate(date, 'YYYY/MM/D HH:MM')}</span>
        <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
      </p>
    </div>
  </li>`;
  });
  return template;
};


const createPopupTemplate = (film, filmComments) => {
  const { comments,
    userDetails: { isFavorite, isWatched, inWatchlist },
    filmInfo: { poster, ageRating, title, alternativeTitle, rating, director, writers, actors, release, runtime, country, description, genre, }
  } = film;
  const currentComments = createCommentsTemplate(filmComments);
  const filmDuration = convertMinutesToHours(runtime).hours + 'h ' + convertMinutesToHours(runtime).minutes + 'm';
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
  <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">
  
            <p class="film-details__age">${ageRating}+</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${humanizeDate(release.date)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${filmDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${genre.join(', ')}</span>
                  </td>
              </tr>
            </table>
  
            <p class="film-details__film-description">${description}</p>
          </div>
        </div>
  
        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${inWatchlist ? 'film-details__control-button--active': '' } " id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${isWatched ? 'film-details__control-button--active': '' }" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${isFavorite ? 'film-details__control-button--active': '' }" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmComments.length}</span></h3>
          <ul class="film-details__comments-list">
          ${currentComments}
          </ul>
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>
  
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>
  
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
      </form>
</section>`
};

export default class Popup extends Smart { 
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._popupForm = this.getElement().querySelector('form');
  
    this._closeWindowHandler = this._closeWindowHandler.bind(this);
    
    this._setWatchlistHandler = this._setWatchlistHandler.bind(this);
    this._setFavoriteHandler = this._setFavoriteHandler.bind(this);
    this._setWatchedHandler = this._setWatchedHandler.bind(this);
  
    this._checkEmojiHandler = this._checkEmojiHandler.bind(this);
    this._setDeleteButtonClickHandler = this._setDeleteButtonClickHandler.bind(this);
    this._setCommentInputHandler = this._setCommentInputHandler.bind(this);
    this._setCommentSubmitHandler = this._setCommentSubmitHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._film, this._comments);
  }


  _setInnerHandlers() {

    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._setCommentInputHandler);
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._checkEmojiHandler);
  }


  _closeWindowHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  setCloseWindowHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeWindowHandler);
  }
  
  restoreHandlers() {
      this.setCloseWindowHandler(this._callback.closeWindow);
     this.setWatchedHandler(this._callback.watchedClick);
      this.setFavoriteHandler(this._callback.favoriteClick);
      this.setWatchlistHandler(this._callback.watchlistClick);
      this.setDeleteButtonClickHandler(this._callback.deleteButtonClick);
      this.setCommentSubmitHandler(this._callback.commentSubmit);
  }
  
  _setWatchlistHandler(evt) {
      evt.preventDefault();
      console.log("_setWatchlistPopupHandler");
      this._callback.watchlistClick();
  }
  
  setWatchlistHandler(callback) {
      this._callback.watchlistClick = callback;
      this.getElement()
        .querySelector('#watchlist')
        .addEventListener('click', this._setWatchlistHandler);
  }
  
  _setWatchedHandler(evt) {
    evt.preventDefault();
    console.log("_setWatchedPopupHandler");
    this._callback.watchedClick();
  }
    
  setWatchedHandler(callback) {
        this._callback.watchedClick = callback;
        this.getElement()
          .querySelector('#watched')
          .addEventListener('click', this._setWatchedHandler);
  }
      
  _setFavoriteHandler(evt) {
        evt.preventDefault()
        console.log("_setFavoritePopupHandler");
        this._callback.favoriteClick();
  }
      
  setFavoriteHandler(callback) {
        this._callback.favoriteClick = callback;
        this.getElement()
        .querySelector('#favorite')
        .addEventListener('click', this._setFavoriteHandler);
  }
      
  _setCommentSubmitHandler(evt) {
    const commentForm = this.getElement().querySelector('form');
    const commentTextarea = commentForm.elements['comment'];

    if ((evt.ctrlKey || evt.metaKey) && evt.code === 'Enter') {
      if (this._film.comment && this._film.emotion) {
        this._callback.commentSubmit(this._film.id, this._film);
        document.removeEventListener('keydown', this._setCommentSubmitHandler);
      } else {
        commentTextarea.setCustomValidity(ErrorMessage.COMMENT);
        commentTextarea.reportValidity();
      }
    }
  }

  setCommentSubmitHandler(callback) {
    this._callback.commentSubmit = callback;
    document.addEventListener('keydown', this._setCommentSubmitHandler);
  }

  _setDeleteButtonClickHandler(evt) {
    if (evt.target.dataset.commentId) {
    evt.preventDefault();
      const commentId = evt.target.dataset.commentId;
      this._callback.deleteButtonClick(commentId);
    }
  }

  setDeleteButtonClickHandler(callback) {
    this._callback.deleteButtonClick = callback;
    this.getElement().addEventListener('click', this._setDeleteButtonClickHandler);
  }

  _setCommentInputHandler (evt) {
      evt.preventDefault();
      this.updateData({
        comment: evt.target.value,
      }, true);
  }

  _checkEmojiHandler() {
    const currentEmoji = this._popupForm.elements['comment-emoji'].value;
    this.updateData({
        emotion: `${currentEmoji}`,
    }, true);
    
    const container = this.getElement().querySelector('.film-details__add-emoji-label');
    if (container.querySelector('img')) {
      const newImage = this.getElement().querySelector('.film-details__add-emoji-label img');
      newImage.src = `./images/emoji/${currentEmoji}.png`;
      newImage.alt = `emoji-${currentEmoji}`;
    } else {
      const element = document.createElement('img');
      element.src = `./images/emoji/${currentEmoji}.png`;
      element.alt = `emoji-${currentEmoji}`;
      element.width = '55';
      element.height = '55';
      render(container, element, RenderPosition.BEFOREEND);
    }
  }


  toggleCommentFormDisable() {
    const commentTextarea = this._popupForm.elements['comment'];
    const emojiInputs = this._popupForm.elements['comment-emoji'];

    commentTextarea.disabled = !commentTextarea.disabled;
    emojiInputs.forEach((input) => {
      input.disabled = !input.disabled;
    });
  }

  toggleDeleteButtonDisable(id) {
    const deleteButton = this._popupForm.querySelector(`[data-comment-id="${id}"]`);
    deleteButton.disabled = !deleteButton.disabled;
    deleteButton.textContent = deleteButton.disabled ? 'Deleting...' : 'Delete';
  }

  toggleShakeEffect() {
    this.getElement().classList.add('shake');
    setTimeout(() => {
      this.getElement().classList.remove('shake');
    }, 1000);
  }

}
  