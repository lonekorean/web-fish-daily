var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	
	res.locals.data = {
		links: []
	};

	// load today's links
	view.on('init', function(next) {
		// create UTC date, snapped to most recent midnight
		var localDate = new Date();
		var publishOn = new Date(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate())
		
		keystone.list('Link').model.find()
			.where('publishOn', publishOn)
			.exec(function(err, results) {
				console.log(results.length);
				res.locals.data.links = results;
				next(err);
			});
	});

	// render
	view.render('index');	
};
