var keystone = require('keystone'),
	moment = require('moment-timezone');

exports = module.exports = function(req, res) {
	function getCurrentDate() {
		// dates are stored in UTC, but this uses Seattle time so that new
		// links are published at Seattle's midnight instead of UTC midnight
		return moment.tz(Date.now(), 'America/Vancouver').format('YYYY-M-D');
	}

	var view = new keystone.View(req, res);
	res.locals.data = {
		links: []
	};

	// load today's links
	view.on('init', function(next) {
		var publishOn = req.params.date || getCurrentDate();
		
		keystone.list('Link').model.find()
			.where('publishOn', publishOn)
			.exec(function(err, results) {
				res.locals.data.links = results;
				next(err);
			});
	});

	// render
	view.render('links');
};
