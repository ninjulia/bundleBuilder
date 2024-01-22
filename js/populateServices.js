////////////////////////////////////
//  Set Services on DOM
////////////////////////////////////

//imports
import { errorModal, getData } from './fetchData.js';

//get Services from json
const promiseServices = getData('./data/services.json');
const services = await Promise.resolve(promiseServices)
	.then((data) => data)
	.catch((e) => errorModal(e));

//create radio buttons from json data & set in DOM
export default function populateServices(serviceType) {
	let serviceCollection = [];

	services.map((service) => {
		if (service.type === serviceType) {
			serviceCollection.push(service);
		} else {
			return;
		}
	});

	//sort by id to display in descending order
	serviceCollection.sort();

	//add services to DOM
	let container = document.getElementById(serviceType).querySelector('.service-container');

	serviceCollection.map((item) => {
		//change name='phone' to name='voice' to avoid browser autofill issue
		serviceType === 'phone' ? (serviceType = 'voice') : serviceType;

		let serviceItem = document.createElement('label');
		let radio = `
            <input type="radio" id="${item.id}" name="${serviceType}" value="${item.name}" data-desc="${item.fullDesc}" />
            <span class="checkmark"></span>
			<img src="./img/${item.id}.svg" alt="" />
			<span class="title">${item.shortName}</span>
        `;

		serviceItem.setAttribute('for', item.id);
		serviceItem.classList.add('container');
		serviceItem.insertAdjacentHTML('beforeend', radio);

		//set tooltip
		if (item.shortDesc !== null) {
			let intro;
			serviceType === 'internet' ? (intro = `<strong>Great for: </strong>`) : (intro = '');

			let toolTip = `<span role="tooltip" id="${item.id}Tip" class="flex-column justify-center border-radius-small">${intro}${item.shortDesc}</span>`;
			serviceItem.setAttribute('aria-describedby', `${item.id}Tip`);
			serviceItem.insertAdjacentHTML('beforeend', toolTip);
		}

		container.firstChild.after(serviceItem);
	});
}
