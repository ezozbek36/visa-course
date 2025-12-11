import Swiper from 'swiper'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

function initCarousel() {
	const carouselElement = document.querySelector('.carousel-cards')

	if (carouselElement) {
		new Swiper(carouselElement, {
			modules: [Pagination],
			slidesPerView: 'auto',
			spaceBetween: 20,
			centeredSlides: true,
			grabCursor: true,
			pagination: {
				el: '.carousel-cards__indicators',
				clickable: true,
				bulletClass: 'carousel-cards__indicator',
				bulletActiveClass: 'carousel-cards__indicator--active',
			},
			breakpoints: {
				481: {
					centeredSlides: false,
					spaceBetween: 0,
				},
			},
		})
	}
}

document.addEventListener('DOMContentLoaded', initCarousel)
