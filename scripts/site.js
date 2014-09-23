// make full area of cards clickable
$(function() {
	function initCards() {
		$('.cards article').on('click', triggerClick);
	}

	function triggerClick(e) {
		// trigger click on card's link only if click target isn't already a link
		if (!$(e.target).is('a')) {
			$(this).find('h3 a')[0].click();
		}
	}

	initCards();
});

// display and maintain countdowns
$(function() {
	function initCountdowns() {
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
			location.reload(true);
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

	initCountdowns();
});
