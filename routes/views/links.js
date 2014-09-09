var keystone = require('keystone'),
	moment = require('moment-timezone');

exports = module.exports = function(req, res) {
	// constants
	var TIMEZONE = 'America/Vancouver';
	var HOME_PATH = '/home';
	var SNEAK_PEAK_HOUR = 18;

	// setup
	var view = new keystone.View(req, res);
	res.locals.data = {
		links: []
	};

	function getDate(dayOffset) {
		dayOffset = dayOffset || 0;
		// dates are stored in UTC, but this uses Seattle time so that new
		// links are published at Seattle's midnight instead of UTC midnight
		return moment.tz(Date.now(), TIMEZONE).add(dayOffset, 'd').format('YYYY-M-D');
	}

	function getHour() {
		return moment.tz(Date.now(), TIMEZONE).hour();
	}

	// load links
	view.on('init', function(next) {
		var publish = req.params.date || getDate();
		res.locals.data.publish = publish;

		keystone.list('Link').model.find()
			.where('publish', publish)
			.exec(function(err, results) {
				res.locals.data.links = results;
				next(err);
			});
	});

	// load sneak peak link
	view.on('init', function(next) {
		if (req.route.path !== HOME_PATH || getHour() < SNEAK_PEAK_HOUR) {
			next();
		} else {
			var publish = getDate(1);
			
			keystone.list('Link').model.find()
				.where('publish', publish)
				.limit(1)
				.exec(function(err, results) {
					if (results.length > 0) {
						res.locals.data.links.push(results[0]);
					}
					next(err);
				});
		}
	});	

	// render
	view.render('links');
};
