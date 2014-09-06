var keystone = require('keystone'),
	moment = require('moment-timezone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	
	res.locals.data = {
		links: []
	};

	// load today's links
	view.on('init', function(next) {
		// dates are stored in UTC, but we'll compare to Seattle time so that
		// new links are published at Seattle's midnight instead of UTC midnight
		var seattleMoment = moment.tz(Date.now(), 'America/Vancouver');
		var mostRecentMidnight = new Date(seattleMoment.year(), seattleMoment.month(), seattleMoment.date());
		
		keystone.list('Link').model.find()
			.where('publishOn', mostRecentMidnight)
			.exec(function(err, results) {
				res.locals.data.links = results;
				next(err);
			});
	});

	// render
	view.render('home');
};
