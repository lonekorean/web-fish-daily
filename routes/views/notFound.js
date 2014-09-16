var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	//var config = keystone.app.locals.config;

	// set response code
	view.on('init', function(next) {
		res.status(404);
		return next();
	});

	// render
	view.render('notFound');
};
