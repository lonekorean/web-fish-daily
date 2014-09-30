/* global ga */

'use strict';

// namespace
window.wfd = {};

// global event tracking helper
window.wfd.trackEvent = function(category, action, label) {
	if ('ga' in window) {
		ga('send', 'event', category, action, label);
	} else {
		console.log('trackEvent()', category, action, label);
	}
};

// track outbound links
$(function() {
	function init() {
		$('.cards article h3 a, footer a').on('click', trackOutboundClick);
	}

	function trackOutboundClick(e) {
		var url = $(e.currentTarget).attr('href');
		window.wfd.trackEvent('outbound', 'click', url);
	}

	init();
});

// make entirety of cards clickable
$(function() {
	function init() {
		$('.cards article').on('click', triggerClick);
	}

	function triggerClick(e) {
		// trigger click on card's link only if click target isn't already a link
		if (!$(e.target).is('a')) {
			$(e.currentTarget).find('h3 a')[0].click();
		}
	}

	init();
});

// display and maintain countdowns
$(function() {
	function init() {
		$('.time').each(function() {
			var $time = $(this);
			var endSeconds = getCurrentSeconds() + parseInt($time.attr('data-seconds'), 10);
			displayCountdown($time, endSeconds);
			setInterval(updateCountdown.bind(undefined, $time, endSeconds), 1000);
		});
	}

	function updateCountdown($time, endSeconds) {
		if (getCurrentSeconds() < endSeconds) {
			displayCountdown($time, endSeconds);
		} else {
			// done
			window.location.reload(true);
		}
	}

	function displayCountdown($time, endSeconds) {
		var secondsRemaining = endSeconds - getCurrentSeconds();
		$time.text(formatCountdown(secondsRemaining));
	}

	function formatCountdown(secondsRemaining) {
		var date = new Date(Math.max(secondsRemaining, 0) * 1000);
		var hours = date.getUTCHours();
		var minutes = date.getUTCMinutes();
		var seconds = date.getUTCSeconds();

		var value, unit;
		if (hours) {
			// rounded up
			value = hours + (minutes > 0 ? 1 : 0);
			unit = 'hour';
		} else if (minutes) {
			// rounded up
			value = minutes + (seconds > 0 ? 1 : 0);
			unit = 'minute';
		} else {
			value = seconds;
			unit = 'second';
		}

		return value + ' ' + unit + (value !== 1 ? 's' : '');
	}

	function getCurrentSeconds() {
		return Math.ceil(Date.now() / 1000);
	}

	init();
});
