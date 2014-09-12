var keystone = require('keystone');

exports = module.exports = function(req, res) {
	// setup
	var view = new keystone.View(req, res);

	// nothing
	view.on('init', function(next) {
		return next();
	});

	// render
	view.render('coming', { layout: false });
};
