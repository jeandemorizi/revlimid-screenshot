const cli_progress = require('cli-progress');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const mergeImg = require('merge-img');
const config = require('./config.json');

// GLOBALS
let base_url = config.base_url;
let viewport = config.viewport;
let screenshot_path = config.screenshot_path;
let pages = [...config.pages.mm, ...config.pages.mds, ...config.pages.mcl, ...config.pages.rrfl];
let class_filter = '';

// CREATE A NEW PROGRESS BAR INSTANCE AND USE SHADES_CLASSIC THEME
const progress_bar = new cli_progress.SingleBar({}, cli_progress.Presets.shades_classic);
const argv = require('minimist')(process.argv.slice(2));

function parseArgs() {
	switch(argv.v) {
		case 'mobile':
			viewport = { width: 376, height: 736 }; break;
		case 'tablet':
			viewport = { width: 768, height: 1024 }; break;
		case 'large-tablet':
			viewport = { width: 992, height: 867 }; break;
		case 'desktop':
			viewport = { width: 1200, height: 867 }; break;
		case 'large-desktop':
			viewport = { width: 1680, height: 867 }; break;
		default:
	}
	if (!!argv.s) {
		pages = config.pages[argv.s];
	}
	if (argv.u != null) {
		base_url = argv.u;
	}
	if (argv.c != null) {
		class_filter = argv.c;
	}
}

const saveScreenshots = async () => {
	const browser = await puppeteer.launch();
	let i = 1;
	progress_bar.start(pages.length, 0);
	const images = [];

	return Promise.all(pages.map(async p => {
	  const tab = await browser.newPage();
	  await tab.setViewport(viewport)

	  // GOING TO URL
	  let url = base_url + p;
		try {
			await tab.goto(url);

			let contain_class = await containClass(tab, class_filter);

			if (contain_class || class_filter == '') {
				// CLOSING THE MODAL FOR THE FIRST PAGE
				if (i === 1) await closeModal(tab);

				// CREATING THE PNG
				const fileName = `${screenshot_path}/${generateFileName(i, p)}`;
				const screenshotOptions = {
					fullPage: true,
					type: 'jpeg'
				}
				if (!argv.b) {
					screenshotOptions.path = fileName;
				}
				const buffer = await tab.screenshot(screenshotOptions);
				images.push({buffer, fileName});
			}
			progress_bar.update(i);
			i++;
		} catch (e) {
			console.log(e);
		}
	}))
	  .then(async () => {
		  if (argv.m) {
			  await join(images, `${argv.s} - ${argv.v || 'desktop'}`)
		  }
		  await browser.close();
	  });
}

async function closeModal(tab) {
	await tab.evaluate(() => {
		let elements = document.querySelector('[data-modal="identify"]').getElementsByClassName('js-modal-close');
		for (let element of elements)
			element.click();
	});
	await tab.waitFor(1000);
}

function generateFileName(index, page) {
	let filename = page.replace(base_url, "").substring(1).replace(/\//g, " - ");

	if (!(filename.startsWith("mcl") || filename.startsWith("mds") || filename.startsWith("rrfl"))) {
		filename = 'mm - ' + filename;
	}
	return ( filename != "mm - " ? filename : "mm") + '.jpg';
}

function deleteFiles() {
	const directory = 'images';

	fs.readdir(directory, (err, files) => {
		if (err) throw err;

		for (const file of files) {
			if (file.endsWith('.jpg')) {
				fs.unlink(path.join(directory, file), err => {
					if (err) throw err;
				});
			}

		}
	});
}

async function containClass(tab, class_filter) {
	let contain_class = await tab.evaluate((cf) => {
		let data = [];
		let elements = document.getElementsByClassName(cf);
		for (var element of elements)
			data.push(1);
		return data.length ? true : false;
	}, class_filter);
	return contain_class;
}

const run = async () => {
	parseArgs();
	deleteFiles();
	return await saveScreenshots();
}

/**
 *
 * @param images {Array.<{fileName: String, buffer: Buffer}>}
 * @param fileName
 * @returns {Promise<any>}
 */
const join = async (images,
					fileName = 'merged') => {
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

run().then(() => {
	progress_bar.stop();
	console.log('\nSuccess!');
	// return process.exit();
});
