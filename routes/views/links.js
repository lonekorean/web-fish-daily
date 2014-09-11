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

	// get the present moment, timezone shifted
	function getPresentMoment() {
		return moment.tz(Date.now(), TIMEZONE)
	}

	// create a new moment, offset by some number of days
	function createOffsetMoment(originalMoment, dayOffset) {
		return moment(originalMoment).add(dayOffset, 'd')
	}

	// calculate dates
	view.on('init', function(next) {
		// default to the present date
		var currentMoment = getPresentMoment();

		// give incoming date param a chance to override, if valid
		if (req.params.date) {
			var incomingMoment = moment(req.params.date, DATE_FORMAT);
			if (incomingMoment.isValid()) {
				currentMoment = incomingMoment;
			} else {
				// error
				next('nope');
			}
		}

		res.locals.data.currentDate = currentMoment.format(DATE_FORMAT);
		res.locals.data.prevDate = createOffsetMoment(currentMoment, -1).format(DATE_FORMAT);
		res.locals.data.nextDate = createOffsetMoment(currentMoment, 1).format(DATE_FORMAT);

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
		if (req.route.path === HOME_PATH && getPresentMoment().hour() >= SNEAK_PEAK_HOUR) {
			keystone.list('Link').model.find()
				.where('publish', res.locals.data.nextDate)
				.limit(1)
				.exec(function(err, results) {
					if (results.length > 0) {
						res.locals.data.links.push(results[0]);
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
