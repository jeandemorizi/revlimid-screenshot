'use strict';

const fs = require('fs');
const path = require('path');

class imageHelper {
	constructor(base_url, screenshot_path) {
		this.base_url = base_url;
		this.screenshot_path = screenshot_path;
	}
	/**
	 *
	 * @param images {Array.<{fileName: String, buffer: Buffer}>}
	 * @param fileName
	 * @returns {Promise<any>}
	 */
	async join(images, fileName = 'merged') {
		const paths = images.map(item => item.fileName);
		console.log("\n");
		console.log(paths);
		// images are not aligned in the order of the config,
		// therefore need to output the array to know which image belongs to which path
		// TODO: need to make that the images are aligned in the same order of config
		// TODO: alternatively create a .txt file with the order
		return mergeImg(argv.b ? images.map(item => item.buffer) : paths)
		.then((img) => {
			// Save image as file
			img.write(`${screenshot_path}/${fileName}.png`, () => console.log('done merging'));
		})
		.catch(error => console.log(error));
	}
}

module.exports = imageHelper;
