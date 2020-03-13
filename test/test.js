'use strict';

const config = require('./../config');
const screenshotCollector = require('../controllers/screenshotCollector');
let pages = [];
Object.keys(config.pages).map(function(key){
	pages = pages.concat(config.pages[key]);
});

const argv = require('minimist')(process.argv.slice(2));

try {
	let viewport = config.viewports[argv.viewport] || config.viewports[argv.v] || config.viewports['default'];
	let subpages = config.pages[argv.site] || config.pages[argv.s] || pages;
	let { base_url, screenshot_path } = config;
	let class_filter = argv.class_filter || argv.c | '';
	let screenshot = new screenshotCollector(viewport, subpages, base_url, screenshot_path, class_filter);
	screenshot.run();
} catch (err) {
	console.error(err)
}