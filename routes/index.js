var keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);
	//_ = require('underscore')

// common middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.initErrorHandler);

// error handling
keystone.set('404', function(req, res) {
	res.handleError(404, 'Whatever you were looking for, it\'s not here.');
});
keystone.set('500', function(err, req, res) {
	res.handleError(500, 'Hm, something unexpected happened.', err);
});

// import route controllers
var routes = {
	views: importRoutes('./views')
};

// setup route bindings
exports = module.exports = function(app) {
	app.get('/', routes.views.links);
	app.get('/archives/:date', routes.views.links);
};
