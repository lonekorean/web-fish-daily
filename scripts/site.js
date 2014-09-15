$(function() {

	function init() {
		startCountdowns();
	}

	function startCountdowns() {
		if (scriptVars.tomorrowCountdown || scriptVars.sneakPeakCountdown) {
			var $countdowns = $('.countdowns');
			$countdowns.show();

			// setup tomorrow countdown
			if (scriptVars.tomorrowCountdown) {
				$countdowns
					.find('.tomorrow').show()
					.find('.time')
						.text(formatCountdown(scriptVars.tomorrowCountdown))
						.attr('data-countdown', scriptVars.tomorrowCountdown);
			}

			// setup sneak peak countdown
			if (scriptVars.sneakPeakCountdown) {
				$countdowns
					.find('.sneak-peak').show()
					.find('.time')
						.text(formatCountdown(scriptVars.sneakPeakCountdown))
						.attr('data-countdown', scriptVars.sneakPeakCountdown);
			}

			setInterval(updateCountdowns.bind(undefined, $countdowns), 1000);
		}
	}

	function updateCountdowns($countdowns) {
		$countdowns.find('[data-countdown]').each(function() {
			var $time = $(this);

			var remaining = $time.attr('data-countdown') - 1;
			$time.text(formatCountdown(remaining));

			if (remaining > 0) {
				$time.attr('data-countdown', remaining);
			} else {
				// stop countdown and reload page
				$time.removeAttr('data-countdown');
				location.reload(true);
			}
		});
	}

	function formatCountdown(seconds) {
		var date = new Date(seconds * 1000);
		return date.getUTCHours() + 'h ' + date.getUTCMinutes() + 'm ' + date.getUTCSeconds() + 's';
	}

	init();
});
