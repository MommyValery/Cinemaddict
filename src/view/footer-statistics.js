import Abstract from "./abstract.js";

const createStatisticsTemplate = (filmsCount) => {
    return `<section class="footer__statistics">
    <p>${filmsCount} movies inside</p>
  </section>`;
}



export default class footerStatistics extends Abstract {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }
  getTemplate() {
    return createStatisticsTemplate(this._filmsCount);
  }  
}
