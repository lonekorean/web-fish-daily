var keystone = require('keystone'),
	moment = require('moment-timezone');

exports = module.exports = function(req, res) {
	// constants
	var TIMEZONE = 'America/Vancouver';	// Seattle local time
	var DATE_FORMAT = 'YYYY-MM-DD';		// ex: 2014-07-25
	var LAUNCH_DATE = '2014-09-11';
	var SNEAK_PEAK_HOUR = 18;

	// create view
	var view = new keystone.View(req, res);

	// miscellaneous setup
	view.on('init', function(next) {
		res.locals.isHome = (req.route.path === '/home');
		return next();
	});

	// calculate dates and related values
	view.on('init', function(next) {
		// the current date, timezone shifted, aligned to midnight
		var actualCurrentDate = moment.tz(TIMEZONE).startOf('d').format(DATE_FORMAT);

		// give incoming date param a chance to override
		var overrideCurrentDate;
		if (req.params.date) {
			var incomingMoment = moment(req.params.date, DATE_FORMAT);
			if (incomingMoment.isValid()) {
				var incomingDate = incomingMoment.format(DATE_FORMAT);
				if (incomingDate >= LAUNCH_DATE && (incomingDate <= actualCurrentDate || req.user)) {
					overrideCurrentDate = incomingDate;
				}
			}

			if (!overrideCurrentDate) {
				// override not set, incoming date was invalid
				res.status(404);
				return next(new Error('Incoming date is invalid: ' + req.params.date));							
			}
		}

		res.locals.showDateNav = true;
		res.locals.currentDate = overrideCurrentDate || actualCurrentDate;

		res.locals.prevDate = moment(res.locals.currentDate).add(-1, 'd').format(DATE_FORMAT);
		res.locals.showPrevDate = (res.locals.prevDate >= LAUNCH_DATE);

		res.locals.nextDate = moment(res.locals.currentDate).add(1, 'd').format(DATE_FORMAT);
		res.locals.showNextDate = (res.locals.nextDate <= actualCurrentDate || req.user);

		return next();
	});

	// load links
	view.on('init', function(next) {
		keystone.list('Link').model.find()
			.where('publish', moment(res.locals.currentDate))
			.limit(6)
			.exec(function(err, results) {
				res.locals.links = results;
				return next(err);
			});
	});

	// load sneak peak link
	view.on('init', function(next) {
		if (res.locals.isHome && moment.tz(TIMEZONE).hour() >= SNEAK_PEAK_HOUR) {
			keystone.list('Link').model.find()
				.where('publish', moment(res.locals.nextDate))
				.limit(1)
				.exec(function(err, results) {
					if (results.length > 0) {
						res.locals.links.push(results[0]);
					}
					return next(err);
				});
		} else {
			return next();
		}
	});	

	// render
	view.render('links');
};
