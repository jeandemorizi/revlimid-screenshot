'use strict';

const fs = require('fs');
const path = require('path');

class FileHelper {
	constructor(base_url, screenshot_path) {
		this.base_url = base_url;
		this.screenshot_path = screenshot_path;
	}
	generateFileName(page) {
		let filename = page.replace(this.base_url, "").substring(1).replace(/\//g, " - ");
	
		if (!(filename.startsWith("mcl") || filename.startsWith("mds") || filename.startsWith("rrfl"))) {
			filename = 'mm - ' + filename;
		}
		return ( filename != "mm - " ? filename : "mm") + '.jpg';
	}
	
	deleteFiles() {
		fs.readdir(this.screenshot_path, (err, files) => {
			if (err) throw err;
	
			for (const file of files) {
				if (file.endsWith('.jpg')) {
					fs.unlink(path.join(this.screenshot_path, file), err => {
						if (err) throw err;
					});
				}
	
			}
		});
	}
}

module.exports = FileHelper;
