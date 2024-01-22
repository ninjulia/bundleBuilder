//imports
import { errorModal } from './fetchData.js';
import populateServices from './populateServices.js';
import { getBundleByPriceIndex, getBundleByService, scrollPrice } from './getBundles.js';
import setBundle from './setBundle.js';

////////////////////////////////////
//  Toggle Services && Price Order of Appearance
////////////////////////////////////

function sortBy(e) {
	let showFirst = document.getElementById(e.target.value);
	document.getElementById('bundlerHeader').after(showFirst);
}

document.getElementById('sortBy').addEventListener('change', sortBy);

////////////////////////////////////
//  Close Dialog
////////////////////////////////////

document.querySelector('#bundlerDialog button').addEventListener('click', (e) => {
	e.preventDefault();
	e.target.parentNode.parentElement.close();
});

////////////////////////////////////
//  Handle Bundle Service Checks
////////////////////////////////////

//enable / disable 'no service' buttons
function handleNullValues(selected) {
	//manage no-service buttons
	let noServiceList = Array.from(document.querySelectorAll('[value="null"]')).filter((item) => !item.checked);

	//disable no-service buttons
	if (selected === 'null') {
		noServiceList.forEach((item) => (item.disabled = true));
	}

	//enable no-service buttons
	if (noServiceList.length === 3) {
		noServiceList.forEach((item) => (item.disabled = false));
	}
}

//add checked = true to service listed in myBundle
//this is so searching by price returns :checked services too!
function checkService(myBundle) {
	//check each entry to enable / disable buttons
	Object.keys(myBundle).forEach((entry) => {
		if (entry === 'internet' || entry === 'phone' || entry === 'video') {
			document.getElementById(myBundle[entry].id).checked = true;
			handleNullValues(myBundle[entry].value);
		}
	});
}

////////////////////////////////////
//  Handle Service Radio Buttons
////////////////////////////////////

function handleServiceButtons(e) {
	//change name='phone' to name='voice' to avoid browser autofill issue
	//.json data uses 'phone' so change it back
	let serviceName;
	e.target.name === 'voice' ? (serviceName = 'phone') : (serviceName = e.target.name);

	myBundle[serviceName] = {
		id: e.target.id,
		value: e.target.value,
		desc: e.target.dataset.desc,
	};
}

//add event listeners to service radio buttons
internet.addEventListener('click', (e) => {
	handleServiceButtons(e);
	updateMyBundle(e);
});

phone.addEventListener('click', (e) => {
	handleServiceButtons(e);
	updateMyBundle(e);
});

video.addEventListener('click', (e) => {
	handleServiceButtons(e);
	updateMyBundle(e);
});

////////////////////////////////////
//  Handle Price Scroll Buttons
////////////////////////////////////

document.getElementById('scrollLeft').addEventListener('click', (e) => {
	scrollPrice(e, myBundle);
	updateMyBundle(e);
});
document.getElementById('scrollRight').addEventListener('click', (e) => {
	scrollPrice(e, myBundle);
	updateMyBundle(e);
});

////////////////////////////////////
//  Update myBundle && DOM on Interaction
////////////////////////////////////

function updateMyBundle(e) {
	//update bundle price && url && services as needed
	e.target.type === 'radio' ? getBundleByService(myBundle) : getBundleByPriceIndex(myBundle);

	checkService(myBundle);
	setBundle(myBundle);
}

////////////////////////////////////
//  Bundle Startup Settings
////////////////////////////////////

//Set Services on DOM, if this doesn't work it breaks everything

populateServices('internet');
populateServices('phone');
populateServices('video');

//Set 'Preferred' Services
const preferredInt = 'I0002'; //10Mbps
const preferredPhn = 'P0002'; //Long Distance
const preferredVid = 'V0001'; //Advanced TV

//Get 'Preferred' Services from Document
const startInternet = document.getElementById(preferredInt);
const startPhone = document.getElementById(preferredPhn);
const startVideo = document.getElementById(preferredVid);

//Build Starting Bundle
let myBundle = {
	internet: {
		id: startInternet.id,
		value: startInternet.value,
		desc: startInternet.dataset.desc,
	},

	phone: {
		id: startPhone.id,
		value: startPhone.value,
		desc: startPhone.dataset.desc,
	},

	video: {
		id: startVideo.id,
		value: startVideo.value,
		desc: startVideo.dataset.desc,
	},

	price: {
		cost: '',
		priceListIndex: '',
	},

	url: '',
};

////////////////////////////////////
//  Initialize Bundle
////////////////////////////////////

checkService(myBundle);
getBundleByService(myBundle);
setBundle(myBundle);
