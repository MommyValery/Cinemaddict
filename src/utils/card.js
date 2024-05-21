import dayjs from "dayjs";

export const humanizeDate = (date, template = 'D MMMM YYYY') => {
  if (template === 'relative') {
    return dayjs().to(date);
  }  
  return dayjs(date).format(template);
}

export const convertMinutesToHours = (minutes) => {
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60
 }
}  

const getWeightForNull = (a, b) => {
  if (a === null && b === null) {
    return 0;
  }
  
  if (a === null) {
    return 1;
  }
  
  if (b === null) {
    return -1;
  }
  
  return null;
  };
  
export const sortFilmDateDown = (a, b) => {
  const first = humanizeDate(a.filmInfo.release.date, 'YYYY');
  const second = humanizeDate(b.filmInfo.release.date, 'YYYY');
  const weight = getWeightForNull(first, second);
  
    if (weight !== null) {
        return weight;
    };

    return dayjs(second).diff(dayjs(first));
};
  
export const sortFilmRatingDown = (a, b) => {
  const weight = getWeightForNull(a.filmInfo.rating, b.filmInfo.rating);

    if (weight !== null) {
        return weight;
    };
      
    return b.filmInfo.rating - a.filmInfo.rating;
  };

export const sortFilmDefault = (a, b) => {
    const weight = getWeightForNull(a.filmInfo.rating, b.filmInfo.rating);
  
      if (weight !== null) {
          return weight;
      };
        
      return a.id - b.id;
    };
  
