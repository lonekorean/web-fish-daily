var keystone = require('keystone'),
	moment = require('moment-timezone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var config = keystone.app.locals.config;

	// miscellaneous setup
	view.on('init', function(next) {
		res.locals.isHome = (req.route.path === '/');
		res.locals.sneakPeakHour = req.query.sneakpeakhour || config.sneakPeakHour;
		res.locals.enableTracking = res.locals.isProd && !res.locals.isSignedIn;

		return next();
	});

	// calculate dates and stuff
	view.on('init', function(next) {
		// the current date, timezone shifted, aligned to midnight
		var actualCurrentDate = moment.tz(config.timezone).startOf('d').format(config.dateFormat);

		// give incoming date param a chance to override
		var overrideCurrentDate;
		if (req.params.date) {
			var incomingMoment = moment(req.params.date, config.dateFormat);
			if (incomingMoment.isValid()) {
				var incomingDate = incomingMoment.format(config.dateFormat);
				if (incomingDate >= config.launchDate && (incomingDate <= actualCurrentDate || res.locals.isSignedIn)) {
					overrideCurrentDate = incomingDate;
				}
			}

			if (!overrideCurrentDate) {
				// override not set, incoming date was invalid
				return res.handleError(404, 'Invalid date. Stop trying to alter the fabric of time.');
			}
		}

		// dates
		res.locals.currentDate = overrideCurrentDate || actualCurrentDate;
		res.locals.prevDate = moment(res.locals.currentDate).add(-1, 'd').format(config.dateFormat);
		res.locals.nextDate = moment(res.locals.currentDate).add(1, 'd').format(config.dateFormat);

		// set canonical URL
		if (res.locals.isHome) {
			res.locals.canonicalUrl = config.host;
		} else {
			res.locals.canonicalUrl = config.host + '/archives/' + res.locals.currentDate;
		}

		// nav dates visiblity
		res.locals.showPrevDate = (res.locals.prevDate >= config.launchDate);
		res.locals.showNextDate = (res.locals.nextDate <= actualCurrentDate || res.locals.isSignedIn);

		return next();
	});

	// load announcement
	view.on('init', function(next) {
		keystone.list('Announcement').model.find()
			.where('publish', moment(res.locals.currentDate))
			.limit(1)
			.exec(function(err, results) {
				if (!err && results.length > 0) {
					res.locals.announcement = results[0];
				}
				return next(err);
			});
	});

	// load links
	view.on('init', function(next) {
		keystone.list('Link').model.find()
			.where('publish', moment(res.locals.currentDate))
			.sort('-priority')
			.populate('category')
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
			var sneakPeakMoment = todayMoment.clone().hour(res.locals.sneakPeakHour);
			var tomorrowMoment = todayMoment.clone().add(1, 'd');

			// the 1 second padding ensures non-zero values
			if (currentMoment.isBefore(sneakPeakMoment)) {
				res.locals.sneakPeakSeconds = sneakPeakMoment.diff(currentMoment, 's') + 1;
			} else {
				res.locals.tomorrowSeconds = tomorrowMoment.diff(currentMoment, 's') + 1;
			}
		}

		return next();
	});

	// load sneak peak link
	view.on('init', function(next) {
		if (res.locals.isHome && moment.tz(config.timezone).hour() >= res.locals.sneakPeakHour) {
			keystone.list('Link').model.find()
				.where('publish', moment(res.locals.nextDate))
				.sort('-priority')
				.limit(1)
				.populate('category')
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

	// set archives page title/description
	view.on('init', function(next) {
		if (!res.locals.isHome) {
			res.locals.title = moment(res.locals.currentDate).format('MMM Do, YYYY');

			// build up description based on this day's content
			var description = '';
			if (res.locals.announcement) {
				description += res.locals.announcement.headline + ' - ';
			}
			if (res.locals.links && res.locals.links.length > 0) {
				description += 'This day\'s catch includes ';
				for (var i = 0; i < 2; i++) {
					var link = res.locals.links[i];
					if (link) {
						if (i > 0) {
							description += ' and ';
						}
						description += 'the "' + link.title + '" ' + link.category.name.toLowerCase();
					}
				}
				description += '.';
			} else {
				description += 'No links for this day.';
			}
			res.locals.description = description;
		}

		return next();
	});

	// render
	view.render('links');
};
