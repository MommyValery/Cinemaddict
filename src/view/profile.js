import { RankName, RankScore } from "../const.js";
import Smart from "./smart.js";

const createProfileTemplate = (count) => {
  const getRankName = () => {
    if (count > 0 && count <= RankScore.NOVICE.MAX) {
      return RankName.NOVICE;   
    } else if (count >= RankScore.FAN.MIN && count <= RankScore.FAN.MAX) {
      return RankName.FAN;
    } else if (count >= RankScore.MOVIE_BUFF.MIN) {
      return RankName.MOVIE_BUFF;
    } else {
      return '';
    }
  }

    const rankName = getRankName();

    return `<section class="header__profile profile">
    <p class="profile__rating">${rankName}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
}


export default class Profile extends Smart {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;


  }

  getTemplate() {
    return createProfileTemplate(this._filmsCount);
  }

}
