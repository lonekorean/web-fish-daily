$(function() {
	function init() {
		startCountdown();
	}

	function startCountdown() {
		$('.time').each(function() {
			var $time = $(this);
			var endDate = new Date($time.attr('data-seconds') * 1000);
			setInterval(updateCountdown.bind(undefined, $time, endDate), 1000);
		})
	}

	function setCountdown() {
		$time.text(formatCountdown(countdown));
	}

	function formatCountdown(countdown) {
		var date = new Date(countdown * 1000);
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

	function updateCountdown($time) {
		var countdown = $time.attr('data-countdown') - 1;

		if (countdown > 0) {
			setCountdown(countdown, $time);
		} else {
			// stop countdown and reload page
			$time.removeAttr('data-countdown');
			location.reload(true);
		}
	}

	init();
});
