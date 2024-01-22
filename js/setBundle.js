////////////////////////////////////
//  Set Services on DOM
////////////////////////////////////

//REMEMBER! Bundle Services are ALWAYS displayed in Internet, Phone, Video order!
export default function setBundle(myBundle) {
	const bundleName = document.getElementById('bundleName');
	const priceDisplay = document.getElementById('pricing');
	const intDisplay = document.getElementById('intDesc');
	const phoneDisplay = document.getElementById('phoneDesc');
	const videoDisplay = document.getElementById('videoDesc');
	const bundleLink = document.getElementById('bundleLink');

	//check if bundle failed to build, return error message
	let checkNulls = [
		myBundle.internet.value,
		myBundle.phone.value,
		myBundle.video.value,
		myBundle.price.cost,
		myBundle.url,
	];

	if (checkNulls.filter((item) => item === 'null').length > 1 || myBundle.price.cost === null) {
		priceDisplay.parentElement.classList.add('none');
		bundleName.textContent = 'Please select another service to continue.';
		intDisplay.textContent = null;
		phoneDisplay.textContent = null;
		videoDisplay.textContent = null;
		bundleLink.classList.add('none');
		return;
	} else {
		priceDisplay.parentElement.classList.remove('none');
		bundleLink.classList.remove('none');
	}

	//set bundle price
	priceDisplay.textContent = myBundle.price.cost;

	//set bundle title, leave blank if null
	let bundleTitleList = [myBundle.internet.value, myBundle.phone.value, myBundle.video.value];

	let bundleTitle = bundleTitleList.filter((title) => title !== 'null');
	let insertAt = bundleTitle.length - 1;
	bundleTitle.splice(insertAt, 0, '&');
	bundleName.textContent = bundleTitle.join(', ').replace('&,', '&');

	//set bundle details, leave blank if null
	let bundleDetails = [myBundle.internet.desc, myBundle.phone.desc, myBundle.video.desc];

	intDisplay.textContent = bundleDetails[0];
	phoneDisplay.textContent = bundleDetails[1];
	videoDisplay.textContent = bundleDetails[2];

	//set bundle link
	bundleLink.textContent = 'Review and Checkout';
	bundleLink.setAttribute('href', myBundle.url);
}
