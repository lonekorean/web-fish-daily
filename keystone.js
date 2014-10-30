require('dotenv').load();

var keystone = require('keystone'),
	expressHandlebars = require('express-handlebars');

// configuration
keystone.init({
	'name': 'Web Fish Daily',
	'brand': 'Web Fish Daily',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'hbs',
	'custom engine': expressHandlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs'
	}).engine,
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'wfd-cookie-secret',
	'mongo': process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/web-fish-daily'
});

// load models
keystone['import']('models');

// common locals for templates
keystone.set('locals', {
	config: {
		host: 'http://www.webfishdaily.com',
		siteName: 'Web Fish Daily',
		siteDescription: 'Web Fish Daily delivers a fresh catch of web development links every day.',
		timezone: 'America/Vancouver',
		dateFormat: 'YYYY-MM-DD',
		launchDate: '2014-10-01',
		sneakPeakHour: 18
	}
});

// routing
keystone.set('routes', require('./routes'));

// it's go time
keystone.start();
