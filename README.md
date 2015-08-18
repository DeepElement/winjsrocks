# WinJS-Rocks!

A framework based on WinJS for building cross platform apps.
(http://winjs.rocks & http://winjsrocks.com)

[![Build Status](https://travis-ci.org/DeepElement/winjs-rocks.svg?branch=stable)](https://travis-ci.org/DeepElement/winjs-rocks)
[![Dev Build Status](https://travis-ci.org/DeepElement/winjs-rocks.svg?branch=master)](https://travis-ci.org/DeepElement/winjs-rocks)

![Thank the knife](http://i.imgur.com/BZ5R5NP.png)

=============================

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
