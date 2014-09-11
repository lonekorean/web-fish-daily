var keystone = require('keystone'),
	moment = require('moment-timezone');

exports = module.exports = function(req, res) {
	// constants
	var TIMEZONE = 'America/Vancouver';			// Seattle local time
	var DATE_DATA_FORMAT = 'YYYY-M-D';			// ex: 2014-7-25
	var DATE_CURRENT_FORMAT = 'MMMM Do, YYYY';	// ex: July 25th, 1980
	var DATE_NAV_FORMAT = 'MMMM Do';			// ex: July 25th
	var HOME_PATH = '/home';
	var SNEAK_PEAK_HOUR = 18;

	// setup
	var view = new keystone.View(req, res);
	res.locals.showDateNav = true;

	// get the present moment, timezone shifted
	function getPresentMoment() {
		return moment.tz(Date.now(), TIMEZONE);
	}

	// create a new moment, offset by some number of days
	function createOffsetMoment(originalMoment, dayOffset) {
		return moment(originalMoment).add(dayOffset, 'd');
	}

	// calculate dates
	view.on('init', function(next) {
		// default to present day
		var currentMoment = getPresentMoment();

		// give incoming date param a chance to override
		if (req.params.date) {
			currentMoment = moment(req.params.date, DATE_DATA_FORMAT);
			if (!currentMoment.isValid()) {
				// TODO: render 404 page
				res.status(404);
			}
		}

		// current date
		res.locals.currentDate = currentMoment.format(DATE_DATA_FORMAT);
		res.locals.currentDateDisplay = (req.route.path === HOME_PATH) ? 'Today' : currentMoment.format(DATE_CURRENT_FORMAT);

		// previous date
		var prevMoment = createOffsetMoment(currentMoment, -1);
		res.locals.prevDate	= prevMoment.format(DATE_DATA_FORMAT);
		res.locals.prevDateDisplay = prevMoment.format(DATE_NAV_FORMAT);

		// next date
		var nextMoment = createOffsetMoment(currentMoment, 1);
		res.locals.nextDate	= nextMoment.format(DATE_DATA_FORMAT);
		res.locals.nextDateDisplay = nextMoment.format(DATE_NAV_FORMAT);

		next();
	});

	// load links
	view.on('init', function(next) {
		keystone.list('Link').model.find()
			.where('publish', res.locals.currentDate)
			.limit(6)
			.exec(function(err, results) {
				res.locals.links = results;
				next(err);
			});
	});

	// load sneak peak link
	view.on('init', function(next) {
		if (req.route.path === HOME_PATH && getPresentMoment().hour() >= SNEAK_PEAK_HOUR) {
			keystone.list('Link').model.find()
				.where('publish', res.locals.nextDate)
				.limit(1)
				.exec(function(err, results) {
					if (results.length > 0) {
						res.locals.links.push(results[0]);
					}
					next(err);
				});
		} else {
			next();
		}
	});	

	// render
	view.render('links');
};
