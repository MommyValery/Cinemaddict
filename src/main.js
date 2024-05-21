import footerStatisticsView  from './view/footer-statistics.js';
import { render, RenderPosition} from './utils/render.js';
import FilmsModel from './model/movies.js';
import FilterModel from './model/filter.js';
import MovieListPresenter  from './presenter/movie-list.js';
import FilterPresenter from './presenter/filter.js';
import ProfilePresenter from './presenter/profile.js';
import Api from './api.js';
import { UpdateType } from './const.js';

// кнопки фаворит итд не работают
//невозможно отправить комент
// не обновляется количество коментов после удаления
const END_POINT = 'https://17.ecmascript.htmlacademy.pro/cinemaddict/';
const AUTHORIZATION = 'Basic jkihloij;oi333';

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const api = new Api(END_POINT, AUTHORIZATION);

api.getFilms()
    .then((films) => {
        filmsModel.setFilms(UpdateType.INIT, films);    
        render(siteFooterElement, new footerStatisticsView(films.length), RenderPosition.BEFOREEND);
    })
    .catch((err) => {
        filmsModel.setFilms(UpdateType.INIT, []);
        render(siteFooterElement, new footerStatisticsView(0), RenderPosition.BEFOREEND);
    });

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, movieListPresenter);
const profilePresenter = new ProfilePresenter(siteHeaderElement, filmsModel);

filterPresenter.init();
movieListPresenter.init();

