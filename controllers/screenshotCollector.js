'use strict';

const cli_progress = require('cli-progress');
const puppeteer = require('puppeteer');
const mergeImg = require('merge-img');
const FileHelper = require('../helpers/fileHelper');
const ImageHelper = require('../helpers/imageHelper');
const Options = require('./../models/options');

let filehelper = null;
// CREATE A NEW PROGRESS BAR INSTANCE AND USE SHADES_CLASSIC THEME
const progress_bar = new cli_progress.SingleBar({}, cli_progress.Presets.shades_classic);

class ScreenshotCollector {
	constructor(options) {
		this.options = options;
		filehelper = new FileHelper(this.options.base_url, this.options.screenshot_path);
	}

	async takeScreenshots() {
		const browser = await puppeteer.launch({defaultViewport: this.options.viewport});
		let i = 1;
		const images = [];
		const self = this;
		progress_bar.start(self.options.pages.length, 0);

		return new Promise(async function(resolve) {
			const tab = await browser.newPage();
			for(let p of self.options.pages) {
				// GOING TO URL
				let url = self.options.base_url + p;
				await tab.goto(url);
	
				let contain_class = !!self.options.class_filter ? await containClass(tab, self.options.class_filter) : null;
				if (contain_class || self.options.class_filter == null) {

					if (i === 1) await self.beforeFirstScreenshot(tab);
	
					// CREATING THE PNG
					const fileName = `${self.options.screenshot_path}/${filehelper.generateFileName(p)}`;
					const screenshotOptions = {
						fullPage: true,
						type: 'jpeg'
					}
					if (!self.options.backup) {
						screenshotOptions.path = fileName;
					}
					const buffer = await tab.screenshot(screenshotOptions);
					images.push({buffer, fileName});
				}
				progress_bar.update(i);
				i++;
			}
			resolve('Success');
		})
		.then(async () => {
			if (this.options.merge) {
				await join(images, `${this.options.site_name} - ${this.options.viewport.name || 'desktop'}`)
			}
			await browser.close();
			progress_bar.stop();
			console.log('\rSuccess!');
			return process.exit();
		});
	}

	async beforeFirstScreenshot(tab) {
		// CLOSING THE MODAL FOR THE FIRST PAGE
		await tab.evaluate(() => {
			let elements = document.querySelector('[data-modal="identify"]').getElementsByClassName('js-modal-close');
			for (let element of elements)
				element.click();
		});
		await tab.waitFor(1000);
	}
	
	async containClass(tab, class_filter) {
		let contain_class = await tab.evaluate((cf) => {
			let data = [];
			let elements = document.getElementsByClassName(cf);
			for (var element of elements)
				data.push(1);
			return data.length ? true : false;
		}, class_filter);
		return contain_class;
	}

	async run() {
		filehelper.deleteFiles();
		return await this.takeScreenshots();
	};
}

module.exports = ScreenshotCollector;

// run().then(() => {
// 	progress_bar.stop();
// 	console.log('\nSuccess!');
// 	return process.exit();
// });
