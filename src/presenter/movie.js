import CardView from '../view/card.js';
import PopupView from '../view/popup.js';
import { replace, render, RenderPosition, remove} from '../utils/render.js';
import { UpdateType, UserAction } from '../const.js';
import CommentsModel from '../model/comment.js';
import dayjs from 'dayjs';


const MODE = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP'
};

export default class Movie {
  constructor(filmListComponent, changeData, changeMode, api) {
    this._filmListComponent = filmListComponent;
    this._filmsContainerComponent = filmListComponent.getElement().querySelector('.films-list__container');
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = new CommentsModel();
    this._api = api;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._mode = MODE.DEFAULT;
    
    this._showDetails = this._showDetails.bind(this);
    this._renderPopup = this._renderPopup.bind(this);
    this._hideDetails = this._hideDetails.bind(this);
    this._EscKeyDownHandler = this._EscKeyDownHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    
    this._handleWatchlistPopupClick = this._handleWatchlistPopupClick.bind(this);
    this._handleWatchedPopupClick = this._handleWatchedPopupClick.bind(this);
    this._handleFavoritePopupClick = this._handleFavoritePopupClick.bind(this);
  
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);

    this._commentsModel.addObserver(this._handleModelEvent);
  }
  
  init(film) {
    this._film = film;
    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;
    this._filmCardComponent = new CardView(this._film);
    this._setFilmsCardHandlers();
    this._handleModelEvent();

    if (prevFilmCardComponent === null) {
      render(this._filmsContainerComponent, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }
  
    if (this._filmListComponent.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }
    remove(prevFilmCardComponent);
  }
  
  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
  }

  _handleModelEvent() {
    if(this._mode === MODE.POPUP) {
      this._hideDetails();
      this._showDetails();
    }
  }

  _setFilmsCardHandlers() {
    this._filmCardComponent.setOpenPopupHandler(this._showDetails);
    this._filmCardComponent.setWatchlistHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteHandler(this._handleFavoriteClick);
  }
  
  _setFilmDetailsClickHandlers() {
    this._filmDetailsComponent.setCloseWindowHandler(this._hideDetails);
    this._filmDetailsComponent.setFavoriteHandler( this._handleFavoritePopupClick);
    this._filmDetailsComponent.setWatchedHandler(this._handleWatchedPopupClick);
    this._filmDetailsComponent.setWatchlistHandler(this._handleWatchlistPopupClick);
    this._filmDetailsComponent.setCommentSubmitHandler(this._handleCommentSubmit);
    this._filmDetailsComponent.setDeleteButtonClickHandler(this._handleDeleteButtonClick);
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            ...this._film.userDetails,
            inWatchlist: !this._film.userDetails.inWatchlist,
          },
        }
      )
    )
  }
  
  _handleWatchedClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            ...this._film.userDetails,
            isWatched: !this._film.userDetails.isWatched,
            watchingDate: dayjs().toDate(),
          },
        }
      )
    )
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            ...this._film.userDetails,
            isFavorite: !this._film.userDetails.isFavorite,
          },
        }
      )
    )
  }
  
  _handleWatchlistPopupClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            ...this._film.userDetails,
            inWatchlist: !this._film.userDetails.inWatchlist,
          },
        }
      )
    );
  }
  
  _handleWatchedPopupClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            ...this._film.userDetails,
            isWatched: !this._film.userDetails.isWatched,
            watchingDate: dayjs().toDate()
          },
        }
      )
    );
  }

  _handleFavoritePopupClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            ...this._film.userDetails,
            isFavorite: !this._film.userDetails.isFavorite,
          },
        }
      )
    )
  }

  _handleCommentSubmit(filmId, comment) {
    this._filmDetailsComponent.toggleCommentFormDisable();
    this._api.addComment(filmId, comment)
      .then(() => {
        this._commentsModel.addComment(UpdateType.MINOR, comment);
      })
      .then((update) => {
        this._changeData(
          UserAction.ADD_COMMENT,
          UpdateType.PATCH,
          Object.assign(
            {},
            this._film,
            { comments: this._film.comments.push(update) }
          ),
        );
      })
      .catch(() => {
        this._filmDetailsComponent.toggleDeleteButtonDisable(id);
        this._filmDetailsComponent.toggleShakeEffect();
      });
  }

  _handleDeleteButtonClick(id) {
    this._filmDetailsComponent.toggleDeleteButtonDisable(id);
    this._api.deleteComment(id)
      .then(() => {
        this._commentsModel.deleteComment(UpdateType.PATCH, id);
        this._changeData(
          UserAction.UPDATE_FILM,
          UpdateType.PATCH,
          Object.assign(
            {},
            this._film,
            {
              comments: this._film.comments.filter((filmComment) => {
                return filmComment !== id;
              }),
            },
          ),
        );
      })
      .catch(() => {
        this._filmDetailsComponent.toggleDeleteButtonDisable(id);
        this._filmDetailsComponent.toggleShakeEffect();
      });
  }

  _showDetails() {
    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._renderPopup(this._commentsModel.getComments());
      })
      .catch(() => {
        this._commentsModel.setComments([]);
        this._renderPopup(this._commentsModel.getComments());
      });
  }   
    
  _renderPopup(comments) {
    this._changeMode();
    this._mode = MODE.POPUP;
    this._filmDetailsComponent = new PopupView(this._film, comments);
    render(document.body, this._filmDetailsComponent, RenderPosition.BEFOREEND);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._EscKeyDownHandler); 
    this._setFilmDetailsClickHandlers();
  }
        
  _EscKeyDownHandler(evt) {
    if (evt.key === 'Shift' || evt.key === 'Esc') {
      this._filmDetailsComponent.reset(this._film);
      evt.preventDefault();
      this._hideDetails();
      document.removeEventListener('keydown', this._EscKeyDownHandler);
    }
  }
  
  _hideDetails() {
    this._commentsModel.setComments([]);
    remove(this._filmDetailsComponent);
    document.body.classList.remove('hide-overflow');
    this._mode = MODE.DEFAULT;
  }
  
  resetView() {
    if (this._mode !== MODE.DEFAULT) {
      this._hideDetails();
    } 
  }
     
}
