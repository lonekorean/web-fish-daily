var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	//var config = keystone.app.locals.config;

	// nothing
	view.on('init', function(next) {
		return next();
	});

	// render
	view.render('coming', { layout: false });
};
