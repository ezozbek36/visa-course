function initForm() {
	const form = document.querySelector('.form')
	const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxtYQsaT5VlDwbGbWDPBVNQt4p5FUkH4YUwPZ7KjPRTCsgO6lp7dKgX7cv78R7gnX5J/exec'

	if (form) {
		// Money formatting (Thousands separator)
		const moneyInputs = form.querySelectorAll('.js-format-money')
		moneyInputs.forEach(input => {
			input.addEventListener('input', e => {
				// Remove existing spaces and non-digits
				let value = e.target.value.replace(/\D/g, '')

				// Add thousands separator
				value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

				e.target.value = value
			})
		})

		// Localize HTML5 validation messages
		const elements = form.querySelectorAll('input, textarea')
		elements.forEach(element => {
			element.addEventListener('invalid', () => {
				if (element.validity.valueMissing) {
					element.setCustomValidity("Iltimos, ushbu maydonni to'ldiring")
				} else {
					element.setCustomValidity('')
				}
			})

			element.addEventListener('input', () => {
				element.setCustomValidity('')
			})
		})

		// Phone formatting
		const phoneInput = form.querySelector('#phone')
		if (phoneInput) {
			phoneInput.addEventListener('input', e => {
				let value = e.target.value.replace(/\D/g, '')

				// Assuming 9 chars for Uzbekistan numbering after +998 prefix (XX XXX XX XX)
				if (value.length > 9) {
					value = value.substring(0, 9)
				}

				let formattedValue = ''
				if (value.length > 0) {
					formattedValue = value.substring(0, 2)
				}
				if (value.length > 2) {
					formattedValue += ' ' + value.substring(2, 5)
				}
				if (value.length > 5) {
					formattedValue += ' ' + value.substring(5, 7)
				}
				if (value.length > 7) {
					formattedValue += ' ' + value.substring(7, 9)
				}

				e.target.value = formattedValue
			})
		}

		form.addEventListener('submit', async e => {
			e.preventDefault()

			// Validations
			if (phoneInput) {
				const phoneVal = phoneInput.value.replace(/\s/g, '')
				if (phoneVal.length !== 9) {
					alert("Iltimos, telefon raqamingizni to'liq kiriting (9 ta raqam)")
					return
				}
			}

			const currentIncome = form.querySelector('#current-income')
			const targetIncome = form.querySelector('#target-income')

			if (currentIncome && targetIncome) {
				const currentVal = Number(currentIncome.value.replace(/\s/g, ''))
				const targetVal = Number(targetIncome.value.replace(/\s/g, ''))

				if (currentVal < 0 || targetVal < 0) {
					alert("Iltimos, daromad summasini to'g'ri kiriting")
					return
				}
			}

			const submitButton = form.querySelector('button')
			const originalText = submitButton.textContent
			submitButton.textContent = 'Yuborilmoqda...'
			submitButton.disabled = true

			try {
				const formData = new FormData(form)

				// Format phone number
				const phone = formData.get('phone')
				if (phone) {
					// Remove spaces and add prefix
					const cleanPhone = phone.replace(/\s/g, '')
					formData.set('phone', `+998${cleanPhone}`)
				}

				var data = {}
				formData.forEach((value, key) => {
					// Clean up money fields
					if (key === 'current_income' || key === 'target_income') {
						data[key] = value.replace(/\s/g, '')
					} else {
						data[key] = value
					}
				})

				const response = await fetch(WEB_APP_URL, {
					method: 'POST',
					body: JSON.stringify(data),
				})

				const result = await response.json()
				if (result.status === 'success') {
					alert("Ma'lumotlar muvaffaqiyatli yuborildi!")
					form.reset()
				} else {
					throw new Error(result.message)
				}
			} catch (error) {
				console.error('Error:', error)
				alert("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.")
			} finally {
				submitButton.textContent = originalText
				submitButton.disabled = false
			}
		})
	}
}

document.addEventListener('DOMContentLoaded', initForm)
