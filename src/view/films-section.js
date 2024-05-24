import Abstract from "./abstract.js";

const createFilmSectionTemplate = () => {
  return `<section class="films">
         </section>`  
}

export default class FilmSection extends Abstract {
  getTemplate() {
    return createFilmSectionTemplate();
  }
}
  