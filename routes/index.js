import tile from './tile';
const routerDispatcher = function (app) {
  app.use('/trackView/search', tile);
};

export default routerDispatcher;
