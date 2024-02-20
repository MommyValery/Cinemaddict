export const SortType = {
  DEFAULT: 'default',
  DATE_DOWN: 'date_down',
  RATING_DOWN: 'rating_down',
};
  
export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT'
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
  
export const FilterMode = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites'
};

export const MenuItem = {
  ALL_MOVIES: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATS: 'stats',
};

export const StatsDate = {
  ALL_TIME: {
    type: 'all-time',
    name: 'All time'
  },
  TODAY: {
    type: 'today',
    name: 'Today'
  },
  WEEK: {
    type: 'week',
    name: 'Week'
  },
  MONTH: {
    type: 'month',
    name: 'Month',
  },
  YEAR: {
    type: 'year',
    name: 'Year'
  },
}

export const ErrorMessage = {
  COMMENT: 'Выберите эмоцию и напишите текст комментария',
};

export const RankScore = {
  NOVICE: {
    MIN: 1,
    MAX: 10,
  },
  FAN: {
    MIN: 11,
    MAX: 20,
  },
  MOVIE_BUFF: {
    MIN: 21
  }
}

export const RankName = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff'
}