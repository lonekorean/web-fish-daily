var keystone = require('keystone'),
	moment = require('moment-timezone');

exports = module.exports = function(req, res) {
	// constants
	var TIMEZONE = 'America/Vancouver';
	var DATE_FORMAT = 'YYYY-M-D';
	var HOME_PATH = '/home';
	var SNEAK_PEAK_HOUR = 18;

	// setup
	var view = new keystone.View(req, res);
	res.locals.data = {
		links: []
	};

	function getNowDateString() {
		// dates are stored in UTC, but this uses Seattle time so that new
		// links are published at Seattle's midnight instead of UTC midnight
		return moment.tz(Date.now(), TIMEZONE).format(DATE_FORMAT);
	}

	function getOffsetDateString(dateString, dayOffset) {
		return moment(dateString, DATE_FORMAT).add(dayOffset, 'd').format(DATE_FORMAT);
	}

	function getNowHour() {
		return moment.tz(Date.now(), TIMEZONE).hour();
	}

	// calculate dates
	view.on('init', function(next) {
		// default to the present date
		var currentDateString = getNowDateString();

		// give incoming date param a chance to override, if valid
		if (req.params.date) {
			var incoming = moment(req.params.date, DATE_FORMAT);
			if (!incoming.isValid()) {
				// error
				next('nope');
			} else {
				currentDateString = incoming.format(DATE_FORMAT);
			}
		}

		res.locals.data.currentDate = currentDateString;
		res.locals.data.prevDate = getOffsetDateString(currentDateString, -1);
		res.locals.data.nextDate = getOffsetDateString(currentDateString, 1);

		next();
	});

	// load links
	view.on('init', function(next) {
		keystone.list('Link').model.find()
			.where('publish', res.locals.data.currentDate)
			.limit(6)
			.exec(function(err, results) {
				res.locals.data.links = results;
				next(err);
			});
	});

	// load sneak peak link
	view.on('init', function(next) {
		if (req.route.path !== HOME_PATH || getNowHour() < SNEAK_PEAK_HOUR) {
			next();
		} else {
			keystone.list('Link').model.find()
				.where('publish', res.locals.data.nextDate)
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
