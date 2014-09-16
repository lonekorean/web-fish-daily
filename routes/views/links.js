var keystone = require('keystone'),
	moment = require('moment-timezone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var config = keystone.app.locals.config;

	// miscellaneous setup
	view.on('init', function(next) {
		res.locals.isHome = (req.route.path === config.homePath);
		res.locals.sneakPeakHour = req.query.sneakpeakhour || config.sneakPeakHour;

		return next();
	});

	// calculate dates and related values
	view.on('init', function(next) {
		// the current date, timezone shifted, aligned to midnight
		var actualCurrentDate = moment.tz(config.timezone).startOf('d').format(config.dateFormat);

		// give incoming date param a chance to override
		var overrideCurrentDate;
		if (req.params.date) {
			var incomingMoment = moment(req.params.date, config.dateFormat);
			if (incomingMoment.isValid()) {
				var incomingDate = incomingMoment.format(config.dateFormat);
				if (incomingDate >= config.launchDate && (incomingDate <= actualCurrentDate || req.user)) {
					overrideCurrentDate = incomingDate;
				}
			}

			if (!overrideCurrentDate) {
				// override not set, incoming date was invalid
				return res.handleError(404, 'Invalid date. Stop trying to alter the fabric of time.');
			}
		}

		res.locals.showDateNav = true;
		res.locals.currentDate = overrideCurrentDate || actualCurrentDate;

		// previous
		res.locals.prevDate = moment(res.locals.currentDate).add(-1, 'd').format(config.dateFormat);
		res.locals.showPrevDate = (res.locals.prevDate >= config.launchDate);

		// next
		res.locals.nextDate = moment(res.locals.currentDate).add(1, 'd').format(config.dateFormat);
		res.locals.showNextDate = !!(res.locals.nextDate <= actualCurrentDate || req.user);

		return next();
	});

	// load links
	view.on('init', function(next) {
		keystone.list('Link').model.find()
			.where('publish', moment(res.locals.currentDate))
			.limit(6)
			.exec(function(err, results) {
				if (!err) {
					res.locals.links = results;
				}
				return next(err);
			});
	});

	// calculate countdowns
	view.on('init', function(next) {
		if (res.locals.isHome) {
			// calculate moments
			var currentMoment = moment.tz(config.timezone);
			var todayMoment = currentMoment.clone().startOf('d');
			var tomorrowMoment = todayMoment.clone().add(1, 'd');
			var sneakPeakMoment = todayMoment.clone().hour(res.locals.sneakPeakHour);

			// calculate seconds until tomorrow
			var tomorrowCountdown = tomorrowMoment.diff(currentMoment, 's');
			if (tomorrowCountdown > 0) {
				res.locals.scriptVars.tomorrowCountdown = tomorrowCountdown;
			}

			// calculate seconds until sneak peak
			var sneakPeakCountdown = sneakPeakMoment.diff(currentMoment, 's');
			if (sneakPeakCountdown > 0) {
				res.locals.scriptVars.sneakPeakCountdown = sneakPeakCountdown;
			}
		}

		return next();
	});

	// load sneak peak link
	view.on('init', function(next) {
		if (res.locals.isHome && moment.tz(config.timezone).hour() >= res.locals.sneakPeakHour) {
			keystone.list('Link').model.find()
				.where('publish', moment(res.locals.nextDate))
				.limit(1)
				.exec(function(err, results) {
					if (!err && results.length > 0) {
						res.locals.sneakPeakLink = results[0];
					}
					return next(err);
				});
		} else {
			return next();
		}
	});	

	// set page title
	view.on('init', function(next) {
		if (!res.locals.isHome) {
			res.locals.pageTitle = moment(res.locals.currentDate).format('MMM Do, YYYY');
		}

		return next();
	});

	// render
	view.render('links');
};
