$(function() {
	function init() {
		startCountdown();
	}

	function startCountdown() {
		$('.time').each(function() {
			var $time = $(this);
			var interval = parseInt($time.attr('data-interval'), 10);
			var endTime = Math.ceil(Date.now() / 1000) + interval;
			setCountdown($time, endTime);
			setInterval(updateCountdown.bind(undefined, $time, endTime), 1000);
		});
	}

	function setCountdown($time, endTime) {
		var interval = endTime - Math.ceil(Date.now() / 1000);
		$time.text(formatCountdown(interval));
	}

	function formatCountdown(interval) {
		var date = new Date(interval * 1000);
		var hours = date.getUTCHours();
		var minutes = date.getUTCMinutes();
		var seconds = date.getUTCSeconds();

		if (hours) {
			return hours + ' hour' + (hours > 1 ? 's' : '');
		} else if (minutes) {
			return minutes + ' minute' + (minutes > 1 ? 's' : '');
		} else if (seconds) {
			return seconds + ' seconds' + (seconds > 1 ? 's' : '');
		}
	}

	function updateCountdown($time, endTime) {
		if (Math.ceil(Date.now() / 1000) < endTime) {
			setCountdown($time, endTime);
		} else {
			// done
			location.reload(true);
		}
	}

	init();
});
