'use strict';

const ScreenshotCollector = require('./controllers/screenshotCollector');
const Options = require('./models/options');

try {
	
	let options = new Options();
	let screenshot = new ScreenshotCollector(options);
	screenshot.run();
} catch (err) {
	console.error(err)
}