import Observer from "../utils/observer";

export default class Movies extends Observer {
    constructor() {
        super();
        this._films = [];
    }

    setFilms(updateType, films) {
        this._films = films.slice();
        this._notify(updateType);
    }

    getFilms() {
        return this._films;
    }

    updateFilm(updateType, update) {
        const index = this._films.findIndex((film) => film.id === update.id);

        if (index === -1) {
            throw new Error('Can\'t update unexisting film');
        }
        
        this._films = [
            ...this._films.slice(0, index),
            update,
            ...this._films.slice(index + 1),
        ];

        this._notify(updateType, update);
    };

    static adaptToClient (film) {
        const adaptedFilm = Object.assign(
            {},
            film,
            {
                filmInfo: {
                    title: film.film_info.title,
                    alternativeTitle: film.film_info.alternative_title,
                    rating: film.film_info.total_rating,
                    poster: film.film_info.poster,
                    ageRating: film.film_info.age_rating,
                    director: film.film_info.director,
                    writers: film.film_info.writers,
                    actors: film.film_info.actors,
                    release: {
                      date: film.film_info.release.date,
                      country: film.film_info.release.release_country,
                    },
                    runtime: film.film_info.runtime,
                    genre: film.film_info.genre,
                    description: film.film_info.description,
                  },
                  userDetails: {
                    inWatchlist: film.user_details.watchlist,
                    isWatched: film.user_details.already_watched,
                    watchingDate: film.user_details.watching_date,
                    isFavorite: film.user_details.favorite,
                  },
            }
        )
        
        delete adaptedFilm.film_info;
        delete adaptedFilm.user_details;
        return adaptedFilm;
    }

    static adaptToServer(film) {
        const adaptedFilm = Object.assign(
            {},
            film,
            {
                'film_info': {
                    'title': film.filmInfo.title,
                    'alternative_title': film.filmInfo.alternativeTitle,
                    'poster': film.filmInfo.poster,
                    'description': film.filmInfo.description,
                    'total_rating': film.filmInfo.rating,
                    'release': {
                      'date': film.filmInfo.release.date,
                      'release_country': film.filmInfo.release.country,
                    },
                    'runtime': film.filmInfo.runtime,
                    'genre': film.filmInfo.genre,
                    'director': film.filmInfo.director,
                    'writers': film.filmInfo.writers,
                    'actors': film.filmInfo.actors,
                    'age_rating': film.filmInfo.ageRating,
                  },
                  'user_details': {
                    'watchlist': film.userDetails.inWatchlist,
                    'already_watched': film.userDetails.isWatched,
                    'watching_date': film.userDetails.watchingDate,
                    'favorite': film.userDetails.isFavorite,
                },
            }
        )

        delete film.userDetails;
        delete film.filmInfo;
    
        return adaptedFilm;
    }

    // addComment(film, updateType, update) {
    //     film.comments = [
    //         update,
    //         ...film.comments,
    //     ];
    //     this._notify(updateType, update);
    // }
    
    // deleteComment(film, updateType, update) {
    //     const comments = film.comments;
    //     const index = comments.findIndex((comment)=> {
    //         return comment.id === update.id;
    //       });

    //     if (index === -1) {
    //         throw new Error('Can\'t delete unexisting comment')
    //     }

    //     comments = [
    //         ...comments.slice(0, index),
    //         ...comments.slice(index + 1),
    //     ];
    //     this._notify(updateType);
    // }
    
}