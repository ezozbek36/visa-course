function initForm() {
	const form = document.querySelector('.form')
	const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzozAvG6wpvXgh0npHZpaJZCcGQv6uO4s-e70TJf1sTzaFo86slzw9T3di2fqPjgejs/exec'

	if (form) {
		form.addEventListener('submit', async e => {
			e.preventDefault()

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
				formData.forEach((value, key) => (data[key] = value))

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
