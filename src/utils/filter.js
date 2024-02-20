import { FilterMode } from "../const.js"

export const filter = {
    [FilterMode.ALL]: (films) => films,
    [FilterMode.WATCHLIST]: (films) => films.filter((film) => film.userDetails.inWatchlist),
    [FilterMode.HISTORY]: (films) => films.filter((film) => film.userDetails.isWatched),
    [FilterMode.FAVORITES]: (films) => films.filter((film) => film.userDetails.isFavorite),
    };