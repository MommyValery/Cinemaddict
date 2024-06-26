import Abstract from "./abstract.js";

const createNoFilmsTemplate = () => {
    return `<section class="films-list">
              <h2 class="films-list__title">There are no movies in our database</h2>
            </section> `
}

export default class NoFilms extends Abstract {
  getTemplate() {
    return createNoFilmsTemplate();
  }
}
  