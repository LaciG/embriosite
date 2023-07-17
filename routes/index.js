var bodyParser = require('body-parser');
var Sequelize = require('sequelize');


var apiRouter = require('./api');
var siteRouter = require('./site');

module.exports = function (app) {
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use('/api', apiRouter);
    app.use('/', siteRouter);
  }