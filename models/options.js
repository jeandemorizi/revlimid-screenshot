const config = require('./../config');
const args = require('minimist')(process.argv.slice(2));

class Options {
    constructor() {     
        let allPages = [];
        Object.keys(config.pages).map(function(key){
            allPages = allPages.concat(config.pages[key]);
        });
        this.pages = config.pages[args.site] || config.pages[args.s] || allPages || null;
        this.site_name = args.site || args.s || null;
        this.viewport = config.viewports[args.viewport] || config.viewports[args.v] || config.viewports['default'];
        this.viewport.name = args.viewport || args.v || 'default';
        
        this.base_url = config.base_url || null;
        this.screenshot_path = config.screenshot_path || null;
        this.class_filter = args.class_filter || args.c || null;

        this.backup = args.backup || args.b || null;
        this.merge = args.merge || args.m || null;
    }
}
module.exports = Options; 