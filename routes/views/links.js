var keystone = require('keystone'),
	moment = require('moment-timezone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var config = keystone.app.locals.config;

	// miscellaneous setup
	view.on('init', function(next) {
		res.locals.isHome = (req.route.path === config.homePath);
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
				res.status(404);
				return next(new Error('Incoming date is invalid: ' + req.params.date));							
			}
		}

		res.locals.showDateNav = true;
		res.locals.currentDate = overrideCurrentDate || actualCurrentDate;

		res.locals.prevDate = moment(res.locals.currentDate).add(-1, 'd').format(config.dateFormat);
		res.locals.showPrevDate = (res.locals.prevDate >= config.launchDate);

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
				res.locals.links = results;
				return next(err);
			});
	});

	// load sneak peak link
	view.on('init', function(next) {
		if (res.locals.isHome && moment.tz(config.timezone).hour() >= config.sneakPeakHour) {
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
