import dayjs from "dayjs";
// import { films } from "../mock/films-mock";

export const CHART_BAR = {
    TYPE: 'horizontalBar',
    HEIGHT: 50, 
    FONT_SIZE: 20,
    BG_COLOR: '#ffe800',
    THICKNESS: 24,
    PADDING: 100,
    LABEL_OFFSET: 40,
    LABEL_ALIGN: 'start',
    FONT_SIZE: 20,
    FONT_COLOR: '#ffffff',
}

export const filterToFilterMap = {
    'all-time': (films) => films.filter(({userDetails: isWatched}) => isWatched),
    today: (films) => films.filter(({ userDetails: {watchingDate} }) => {
        return new Date(watchingDate) > dayjs().subtract(1, 'day');
    }),
    week: (films) => films.filter(({userDetails: {watchingDate}}) => {
                return new Date(watchingDate) > dayjs().subtract(1, 'month');
    }),
    month: (films) => films.filter(({userDetails: {watchingDate}}) => {
        return new Date(watchingDate) > dayjs().subtract(1, 'month');
    }),
    year: (films) => films.filter(({ userDetails: {watchingDate} }) => {
            return new Date(watchingDate) > dayjs().subtract(365, 'day');
    }),
};
    

export const getTotalDuration = (films) => {
    if (!films.length) {
        return '';
    }
    return films.map((film) => film.filmInfo.runtime)
     .reduce((accum, value) => {
           return accum + value;
        }, 0);
}

export const getGenresStatistics = (films) => {
    const genresList = {};
    const arr = films.map((film) => film.filmInfo.genre);
    let newArr = [];
    arr.forEach((miniarr) => {
        for (let i = 0; i < miniarr.length; i++) {
            newArr.push(miniarr[i]);
        };
    });
    
    newArr.forEach(function(a){
        if (genresList[a] != undefined)
            ++genresList[a];
        else
            genresList[a] = 1;
    });
    return genresList;
}



export const getTopGenre = (films, filter) => {
 const genres = getGenresStatistics(films);
  const values =  Object.values(genres);
    const max = Math.max(...values);
    for (let key in genres) {
        if (genres[key] === max) {
            return {
                name: key,
                count: genres[key],
            }
        }
    }
}

