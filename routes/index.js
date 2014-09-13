var keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);
	//_ = require('underscore')

// common middleware
keystone.pre('routes', middleware.initLocals);

// import route controllers
var routes = {
	views: importRoutes('./views')
};

// setup route bindings
exports = module.exports = function(app) {
	app.get('/', routes.views.coming);
	app.get('/home', middleware.requireUser, routes.views.links);
	app.get('/archives/:date', routes.views.links);
};
