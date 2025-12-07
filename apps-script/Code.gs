const SHEET_ID = '17nHdECQToRZn2btZJE_nG75BZcLXD3qskdSmfqeW9IY'
const SHEET_NAME = 'Лист1'

function doPost(e) {
	try {
		const data = JSON.parse(e.postData.contents)

		const result = saveToSheet(data)

		return ContentService.createTextOutput(
			JSON.stringify({
				status: 'success',
				message: 'Data saved successfully',
				rowNumber: result.rowNumber,
			}),
		).setMimeType(ContentService.MimeType.JSON)
	} catch (error) {
		return ContentService.createTextOutput(
			JSON.stringify({
				status: 'error',
				message: error.toString(),
			}),
		).setMimeType(ContentService.MimeType.JSON)
	}
}

function saveToSheet(data) {
	const ss = SpreadsheetApp.openById(SHEET_ID)
	const sheet = ss.getSheetByName(SHEET_NAME)

	if (!sheet) {
		throw new Error(`Sheet "${SHEET_NAME}" not found`)
	}

	if (sheet.getLastRow() === 0) {
		const headers = ['Timestamp', 'Name', 'Phone', 'City', 'Current Income', 'Target Income', 'Motivation', 'Offline Study']
		sheet.appendRow(headers)

		const headerRange = sheet.getRange(1, 1, 1, headers.length)
		headerRange.setFontWeight('bold')
		headerRange.setBackground('#4285f4')
		headerRange.setFontColor('#ffffff')
	}

	const timestamp = new Date()
	const rowData = [data.name, data.phone, data.city, data.current_income, data.target_income, data.motivation, data.offline_study, timestamp]

	sheet.appendRow(rowData)

	return {
		rowNumber: sheet.getLastRow(),
	}
}
