////////////////////////////////////
//  Get Bundles By Service or Price Index
////////////////////////////////////

//imports
import { errorModal, getData } from './fetchData.js';

//get list of bundles from json
const promiseBundles = getData('./data/bundles.json');
const bundles = await Promise.resolve(promiseBundles)
	.then((data) => data)
	.catch((e) => errorModal(e));

//new array of bundles sorted by price
const priceList = bundles.sort((a, b) => {
	if (a.price < b.price) {
		return -1;
	}
	if (a.price > b.price) {
		return 1;
	}
	return 0;
});

function getBundleByPriceIndex(myBundle) {
	let newBundle = priceList[myBundle.price.priceListIndex];

	// update Services selections
	let newInternet = internet.querySelector(`[value="${newBundle.internet}"]`);
	let newPhone = phone.querySelector(`[value="${newBundle.phone}"]`);
	let newVideo = video.querySelector(`[value="${newBundle.video}"]`);

	//if bundle not found, return to display error message
	if (typeof newBundle === 'undefined' || newInternet === null || newPhone === null || newVideo === null) {
		myBundle.price.cost = null;
		return;
	}

	myBundle.internet = {
		id: newInternet.id,
		value: newInternet.value,
		desc: newInternet.dataset.desc,
	};
	myBundle.phone = {
		id: newPhone.id,
		value: newPhone.value,
		desc: newPhone.dataset.desc,
	};
	myBundle.video = {
		id: newVideo.id,
		value: newVideo.value,
		desc: newVideo.dataset.desc,
	};

	//return new price
	myBundle.price.cost = newBundle.price.toFixed(2);
	myBundle.url = newBundle.link;

	return myBundle;
}

function getBundleByService(myBundle) {
	//NOTE: This feels overly complex for what it's doing
	// Object.keys(myBundle).forEach((entry) => {
	// 	if (entry === 'internet' || entry === 'phone' || entry === 'video') {
	// 		let service;
	// 		if (myBundle[entry].value === 'null') {
	// 			service = null;
	// 		} else {
	// 			service = myBundle[entry].value;
	// 		}
	// 		nameList.push(service);
	// 	}
	// });

	//search by value only, set 'null' === null
	let nameList = [myBundle.internet.value, myBundle.phone.value, myBundle.video.value];
	let nullValue = nameList.indexOf('null');
	if (nullValue !== -1) {
		nameList[nullValue] = null;
	}

	//find bundle price
	let selectedBundle = bundles.find(
		(obj) => obj.internet === nameList[0] && obj.phone === nameList[1] && obj.video === nameList[2]
	);

	//if bundle not found, return to display error message
	if (typeof selectedBundle === 'undefined') {
		myBundle.price.cost = null;
		return;
	}

	//find bundle position in sorted bundle
	let newIndex = priceList.findIndex((bundle) => bundle.price == selectedBundle.price);

	//update myBundle data
	myBundle.price = { cost: selectedBundle.price.toFixed(2), priceListIndex: newIndex };
	myBundle.url = selectedBundle.link;

	return myBundle;
}

function scrollPrice(e, myBundle) {
	let listMax = Array.from(priceList).length - 1;

	if (e.target.value === '-') {
		0 < myBundle.price.priceListIndex ? myBundle.price.priceListIndex-- : (myBundle.price.priceListIndex = listMax);
	} else {
		myBundle.price.priceListIndex < listMax ? myBundle.price.priceListIndex++ : (myBundle.price.priceListIndex = 0);
	}
}

export { getBundleByPriceIndex, getBundleByService, scrollPrice };
