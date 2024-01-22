# Bundle Builder

This code example was developed for Shenandoah Telecommunications Company (Shentel), a regional cable and internet provider wanting to help customers select a bundle by desired services and budget. The component plugged into their existing CMS and featured within their shopping pages as a sales tool. This code example leverages my original design with updated modern web standard coding techniques.

## Table of contents

- [Overview](#overview)
  - [The Brief](#the-brief)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My Process](#my-process)
  - [Gathering Data](#gathering-data)
  - [Displaying Data](#displaying-data)
  - [Manipulating Data](#manipulating-data)
  - [Edge Cases && Error Handling](#edge-cases-&&-error-handling)
- [Attributions](#Attributions)

## Overview

### The Brief

#### Purpose:

Shentel offers discounts to customers who subscribe to multiple services. These "Bundles" can be _any_ combination of two or three services (phone, internet, or video). Customers need an easy way to pick from services on offer to build a bundle that meets their needs and fits into their monthly budgets.

#### Users should be able to:

- Choose two or three of the company's services (internet, phone, video)
- Choose from the available internet speeds or select none
- Choose from the available phone services or select none
- Choose from the available video services or select none
- View monthly Bundle cost
- Scroll through Bundles based on cost
- See details on Bundle services
- Proceed to the selected Bundle page for review and checkout

#### Business Decisions

- Bundle Builder must fit within existing page template areas _(800px wide)_
- Only feature top-selling internet services (15Mbps, 10Mbps, 5Mbps)
- Show internet speeds first
- Place video offerings last
- Pre-populate the builder with best selling bundle to start (10Mbps, Long Distance, Advanced TV)

### Screenshot

![screenshot](./screenshot.png?raw=true)

### Links

- Live Code URL: [ninjulia.github.io/bundleBuilder](https://ninjulia.github.io/bundleBuilder/)

## My Process

> **A Quick Note About Design**
>
> While I did design the UX && UI of the Bundle Builder, I'm focusing on the code journey here. Feel free to reach out if you'd like to know more about my design choices.

I'm leveraging vanilla HTML, CSS, & Javascript. While this could be a SPA project, I wanted to stay true to the original use case (which, for a variety of reasons, was loaded into Shentel's Sitecore-powered CMS using an iframe 😣). Furthermore, my goal was to code this once and require very little maintenance outside of occasional service/pricing changes (and why I've opted to _over comment_ && split up files). I started with the design, built up the HTML, and added CSS styling focusing on accessibility and handling keyboard navigation. From there I dove into the Javascript process which is detailed below.

### Gathering Data

The shentel.com website operated independently of the billing system, which meant that I had to maintain a list of services and pricing. For the Bundle Builder, I built out two .json files as seen in `_/data/`.

- `bundles.json` all bundles for featured services with pricing, and a URL link to the corresponding details page on shentel.com.
- `services.json` lists marketing details about each service.

This way, if Shentel decided to feature additional levels of individual services, I could add them to `services.json` and build a new `bundles.json` from that file. Pricing data is maintained in `bundles.json` as the monthly cost was calculated independently of the combined cost of the component services.

### Displaying Data

#### Radio Buttons

Each service within `services.json` is used to generate radio buttons by service type via calls to `populateServices()`. These radio buttons store values which are accessed later to look up pricing and display marketing copy. I chose to code the "No Service" buttons within the HTML as setting the radio buttons dynamically could be a major point of failure.

#### Initial Bundle

Bundles are built from the `myBundle` object which maintains the required marketing details, pricing data, and URL. To start, `myBundle` is pre-populated with services via hard-coded variables within `script.js` so that the initial bundle can change as needed without altering the .json files. Data for pricing and URL are initially left blank to avoid any possibility of placeholder data polluting the results.

To display a bundle, three functions are called:

1. `checkService()` manages the `:checked` states of the buttons.
2. `getBundleByService()` finds the matching bundle price and URL from `bundles.json` and returns an updated `myBundle` object.
3. `setBundle()` parses the `myBundle` object and displays the bundle title, service bullet points, and link to the details page for review and checkout.

### Manipulating Data

Users can build their bundle by either selecting the aforementioned service radio buttons or using two buttons to scroll through a list of bundle prices.

#### Find Bundle By Services Process

1. User selects a service button, updating appropriate data within `myBundle`.
2. `updateMyBundle()` is called on form change, which replicates steps 1-3 above.
3. `getBundleByService()` finds the matching bundle price and URL from `bundles.json` and returns an updated `myBundle`.
4. `checkService()` manages the `:checked` states of the buttons.
5. `setBundle()` parses `myBundle` and displays the bundle title, service bullet points, and link to the details page for review and checkout.

#### Find Bundle By Price Process

1. User clicks one of two price select buttons, updating `myBundle.price.priceListIndex` value.
2. `updateMyBundle()` is called on form change, which replicates initial steps 1-3.
3. `getBundleByPriceIndex()` finds the new bundle by index && updates `myBundle`.
4. `checkService()` manages the `:checked` states of the buttons. _this would be an issue if handled via radio buttons alone!_
5. `setBundle()` parses `myBundle` and displays the bundle title, service bullet points, and link to the details page for review and checkout.

### Edge Cases && Error Handling

#### 404 on \*.json

Initially, I had used two `@import` calls to bring in the .json data as variables, but currently, this is not supported in Firefox. I switched to an async fetch call via `getData()`. This method has better ways of managing error handling if for some reason the files can't be accessed. If either fetch failed, I chose to display a non-dismissible `dialog` over the builder as there's nothing a user could do to remedy the situation but return to the page another time.

#### One Service Does Not a Bundle Make

Users could break the builder by selecting a "No Service" Option twice. In a more robust dataset, I could handle this by returning the price and link information for just one service. As is, when a "No Service" button is selected, the other two are disabled. For example, if "No Internet" is selected, both the "No Phone" and "No Video" buttons are disabled. These buttons would be re-enabled when a user selects an Internet service. This is handled via `handleNullValues()` which runs every time `checkService()` is called.

#### Bundle Not Found

If the page loads but a selected bundle can't be found via `getBundleByService()` or `getBundleByPriceIndex()` the expected behavior is to set `myBundle.price.cost` to `'null'`. This will cause `setBundle()` to display a message to the user and have them try to select another bundle.

#### Browser Autofill

Within the HTML, I had to change `name='phone'` to `name='voice'` to avoid an error warning from the browser. The browser expected `name='phone'` to be a text field and attempted to autofill a phone number. The name is reverted within `handleServiceButtons()` before updating `myBundle` to avoid making changes to the .json files. Although running a find/replace on the data would take little effort now, that would no longer be the case when the data is sourced more directly from Shentel's billing system.

## Attributions

Any copyrighted material is the property of the copyright owners. All services, pricing, and bundle links are for review only. While the shentel.com website I spent my days working with is long gone, I rebuilt its styling with some updates from [utopia.fyi](https://utopia.fyi/) to bring this project into the modern era of the web.
