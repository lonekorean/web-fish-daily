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
	'cookie secret': 'y6efodHeho(i~HN;$0HP^)9Dd|SJT./CH1rG!khZM$~v)okHS<!$]HIA&[ofcJGq',
	'mongo': process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/web-fish-daily'
});

// load models
keystone['import']('models');

// common locals for templates
keystone.set('locals', {
	config: {
		host: 'http://www.webfishdaily.com',
		homePath: '/home',
		siteName: 'Web Fish Daily',
		siteDescription: 'A fresh catch of web development links, updated daily.',
		timezone: 'America/Vancouver',
		dateFormat: 'YYYY-MM-DD',
		launchDate: '2014-09-11',
		sneakPeakHour: 18
	}
});

// routing
keystone.set('routes', require('./routes'));

// it's go time
keystone.start();
