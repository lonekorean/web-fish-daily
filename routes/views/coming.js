var keystone = require('keystone');

exports = module.exports = function(req, res) {
	// setup
	var view = new keystone.View(req, res);
	res.locals.data = {};

	// nothing
	view.on('init', function(next) {
		next();
	});

	// render
	view.render('coming', { layout: false });
};
