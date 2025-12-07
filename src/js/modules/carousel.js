function initCarousel() {
	const carouselContainer = document.querySelector('.carousel-cards__container')
	const indicators = document.querySelectorAll('.carousel-cards__indicator')
	const cards = document.querySelectorAll('.carousel-card')

	if (carouselContainer && indicators.length > 0 && cards.length > 0) {
		const observerOptions = {
			root: carouselContainer,
			threshold: 0.5,
		}

		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const index = Array.from(cards).indexOf(entry.target)

					indicators.forEach((indicator, i) => {
						if (i === index) {
							indicator.classList.add('carousel-cards__indicator--active')
						} else {
							indicator.classList.remove('carousel-cards__indicator--active')
						}
					})
				}
			})
		}, observerOptions)

		cards.forEach(card => observer.observe(card))

		indicators.forEach((indicator, index) => {
			indicator.addEventListener('click', () => {
				cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
			})
		})
	}
}

document.addEventListener('DOMContentLoaded', initCarousel)
