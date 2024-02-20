import Abstract from "./abstract.js";

const createFilmsListTemplate = () => {
  return `<section class="films-list">
  <div class="films-list__container"></div>
    </section>`
  }

export default class MainFilmList extends Abstract {
  getTemplate() {
    return createFilmsListTemplate();
  }
}
