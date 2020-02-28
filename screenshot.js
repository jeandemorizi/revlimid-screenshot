
const cli_progress = require('cli-progress');
const config = require('./config.json');

// GLOBALS
var base_url = config.base_url;
var viewport = config.viewport;
var screenshot_path = config.screenshot_path;
var pages = [...config.pages.mm, ...config.pages.mds, ...config.pages.mcl, ...config.pages.rrfl];

// CREATE A NEW PROGRESS BAR INSTANCE AND USE SHADES_CLASSIC THEME
const progress_bar = new cli_progress.SingleBar({}, cli_progress.Presets.shades_classic);
 


function parseArgs() {
	var argv = require('minimist')(process.argv.slice(2));
	
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
	switch(argv.s) {
		case 'mm':
			pages = config.pages.mm; break;
		case 'mcl':
			pages = config.pages.mcl; break;
		case 'mds':
			pages = config.pages.mds; break;
		case 'rrfl' :
			pages = config.pages.rrfl; break;
		default:
	}
	if (argv.u != null) {
		base_url = argv.u;
	}
}

function saveScreenshots() {
	const puppeteer = require('puppeteer');

	(async () => {
	  const browser = await puppeteer.launch();
	  const tab = await browser.newPage();
	  await tab.setViewport(viewport)
	  
	  var i = 1;
	  progress_bar.start(pages.length, 0);
	  for (let p of pages) {

	  	// GOING TO URL
	  	var url = base_url + p;
		await tab.goto(url);

		// CLOSING THE MODAL FOR THE FIRST PAGE
		if(i == 1)  closeModal(tab);

		// CREATING THE PNG
		var filename = generateFileName(i, p);
		await tab.screenshot({
			path: screenshot_path + "/" + filename, 
			fullPage: true, 
			type: 'jpeg'
		});
		
		progress_bar.update(i);
		i++;

	  }
	  progress_bar.stop();
	  console.log('Success!');
	  await browser.close();
	})();
}

function closeModal(tab) {
	(async () => {
		await tab.evaluate(() => {
		    let elements = document.querySelector('[data-modal="identify"]').getElementsByClassName('js-modal-close');
		    for (let element of elements)
		        element.click();
		});
		await tab.waitFor(1000);
	})();
}

function generateFileName(index, page) {
	var filename = page.replace(base_url, "").substring(1).replace(/\//g," - ");

	if (!(filename.startsWith("mcl") || filename.startsWith("mds") || filename.startsWith("rrfl"))) {
		filename = 'mm - ' + filename;
	}
	return ( filename != "mm - " ? filename : "mm") + '.jpg';
}

function run() {
	parseArgs();
	saveScreenshots();
}

run();

