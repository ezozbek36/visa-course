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

		// Mouse Drag Functionality
		let isDown = false
		let startX
		let scrollLeft

		carouselContainer.addEventListener('mousedown', e => {
			isDown = true
			carouselContainer.classList.add('active')
			carouselContainer.style.scrollSnapType = 'none'
			startX = e.pageX - carouselContainer.offsetLeft
			scrollLeft = carouselContainer.scrollLeft
		})

		carouselContainer.addEventListener('mouseleave', () => {
			isDown = false
			carouselContainer.classList.remove('active')
			carouselContainer.style.scrollSnapType = ''
		})

		carouselContainer.addEventListener('mouseup', () => {
			isDown = false
			carouselContainer.classList.remove('active')
			carouselContainer.style.scrollSnapType = ''
		})

		carouselContainer.addEventListener('mousemove', e => {
			if (!isDown) return
			e.preventDefault()
			const x = e.pageX - carouselContainer.offsetLeft
			const walk = (x - startX) * 2 // Scroll speed multiplier
			carouselContainer.scrollLeft = scrollLeft - walk
		})
	}
}

document.addEventListener('DOMContentLoaded', initCarousel)
