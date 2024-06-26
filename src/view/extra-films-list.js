import Abstract from "./abstract.js";

const createExtraFilmsListTemplate = () => {
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">Top rated</h2>
            <div class="films-list__container"></div>
          </section>

          <section class="films-list films-list--extra">
            <h2 class="films-list__title">Most commented</h2>
            <div class="films-list__container"></div>
          </section>`
}

export default class ExtraFilmsList extends Abstract {
  getTemplate() {
    return createExtraFilmsListTemplate();
  }
}
