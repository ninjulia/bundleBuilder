////////////////////////////////////
//  Fetch Data from JSON files
////////////////////////////////////

//pop modal if error
function errorModal(e) {
	let dialog = document.getElementById('bundlerDialog');
	let errorMessage = `<h2 class="display-4">We're sorry, something went wrong</h2><p>Please try building your bundle again later.<br/><small>ERROR: ${e}</small></p>`;

	//remove OK button if Exceptional error
	if (e === 404) {
		dialog.querySelector('button').remove();
	}

	dialog.insertAdjacentHTML('afterbegin', errorMessage);
	dialog.showModal();
}

//import via fetch because FireFox doesn't like import { foo } from 'file.json' assert { type: 'json' };
async function getData(url) {
	try {
		const response = await fetch(url);
		if (response.status != 200) {
			errorModal(response.status);
		} else {
			const data = await response.json();
			return data;
		}
	} catch (e) {
		errorModal(e);
	}
}

export { errorModal, getData };
