WinJS Rocks!
=====

A framework based on WinJS for building cross platform apps.
(http://winjs.rocks & http://winjsrocks.com)

[![Build Status][travis-shield]][travis]
[![Build Status][travis-shield-develop]][travis]
[![Dependency Status][dependencies-shield]][dependencies]
[![devDependency Status][dependencies-dev-shield]][dependencies-dev]
![yo](https://img.shields.io/npm/dm/winjsrocks.svg)

![Thank the knife](http://i.imgur.com/BZ5R5NP.png)

----- 

<!-- START doctoc -->
<!-- END doctoc -->



# IN DEVELOPMENT (UNSTABLE)

## Configuration

```javascript
{
  "ui": {
    "view": {
      "template-uri": "./ui/views/%s/view.html"
    },
    "item-view": {
      "template-uri": "./ui/items/%s/view.html"
    }
  },
  "resources": {
    "scripts": [
      "vendor/jquery.2.1.4/jquery-2.1.4.min.js"
    ],
    "stylesheets": [
      "vendor/winjs/css/ui-dark.css",
      "vendor/winjs/css/ui-dark-intrinsics.css",
      "css/branding.css",
      "css/default.css"
    ]
  },
  "app": {
    "data-sync-interval": "5000"
  }
}
```


[npm]:                     https://www.npmjs.com/package/winjsrocks
[travis]:                  https://travis-ci.org/deepelement/winjsrocks
[travis-shield]:           https://img.shields.io/travis/DeepElement/winjsrocks.svg?branch=stable
[travis-shield-develop]:   https://img.shields.io/travis/DeepElement/winjsrocks.svg?branch=master
[dependencies]:            https://david-dm.org/deepelement/winjsrocks
[dependencies-dev]:        https://david-dm.org/deepelement/winjsrocks#info=devDependencies
[dependencies-shield]:     https://img.shields.io/david/deepelement/winjsrocks.svg
[dependencies-dev-shield]: https://img.shields.io/david/dev/deepelement/winjsrocks.svg
