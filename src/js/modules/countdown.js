function initCountdown() {
	const countdownElement = document.querySelector('.footer__timer')

	if (countdownElement) {
		let hours = 23
		let minutes = 59
		let seconds = 59

		setInterval(() => {
			seconds--

			if (seconds < 0) {
				seconds = 59
				minutes--
			}

			if (minutes < 0) {
				minutes = 59
				hours--
			}

			if (hours < 0) {
				hours = 23
				minutes = 59
				seconds = 59
			}

			const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
			countdownElement.textContent = formattedTime
		}, 1000)
	}
}

document.addEventListener('DOMContentLoaded', initCountdown)
