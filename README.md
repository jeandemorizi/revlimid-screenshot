# Revlimid Auto Screenshots

## Technologies

- JavaScript
    - [**Npm**](https://www.npmjs.com): Package manager used to install dependencies and everything you need.
- Puppeteer
    - Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.
- Cli Progress Bar
    - A simple CLI progress bar.

## Before Getting Started
This Guide assumes you have
- [**Nodejs**](https://yoember.com/nodejs/the-best-way-to-install-node-js/)

## Getting Started

- Install npm project packages `npm install`

## Usage

```bash
node screenshot [OPTIONS]
```

## Usage

- For setting the site, use `-s`, values can be `mm`, `mcl`, `mds`, `rrfl`, default is all the sites in the config.json file.
- For setting the viewport, use `-v`, values can be `mobile` _(376x736)_, `tablet` _(768x1024)_, `large-tablet` _(992x867)_, `desktop` _(1200*867)_, `large-desktop` _(1680*867)_, default viewport is set in the config.json file.
- For setting the base_url, use `-u`, default base url is `http://v2-clg-revhcp.lndo.site` and can be changed in the config.json file.
- For setting the class filter, use `-c`, this option will only take screenshots of pages with the class specified.
- For merging all of the images side by side, use `-m`. To not save the individual screenshots, use `-m -b`

### Examples

* Screenshot the all site in large-desktop viewport 

```bash
$ node screenshot
```

* Screenshot MCL site only in large-desktop viewport

```bash
$ node screenshot -s mcl
```

* Screenshot the all site in desktop viewport

```bash
$ node screenshot -v desktop
```

* Screenshot the rrfl site in large tablet viewport

```bash
$ node screenshot -v large-tablet -s rrfl
```

* Screenshot the mds site with side-by-side class

```bash
$ node screenshot -s mds -c side-by-side
```

* Screenshot MCL site only in large-desktop viewport and merge all of the image into one(will keep the others as well)

```bash
$ node screenshot -s mcl -m
```

* Screenshot MCL site only in large-desktop viewport and merge all of the image into one(will not save individual screenshots)

```bash
$ node screenshot -s mcl -m -b
```

## Author

Jean Paul Demorizi - jeandemorizi@bairesdev.com

