# esm-load-google-maps-api

An ES Module that uses [load-google-maps-api](https://github.com/yuanqing/load-google-maps-api) to load your maps via webpack.

You can either pass params directly to an object, or, get them from a data attribute on your map element on your page. This module will also create a maker for you.

[load-google-maps-api](https://github.com/yuanqing/load-google-maps-api) does use a promise to async load gmaps, so if you want to support IE11 you'll need the core-js polyfill.

## Usage

```bash
npm i esm-load-google-maps-api
```

Add some an element to your template using the specific classes `.js-map`.

In your entry point:

```js
import gmapLoader from 'esm-load-google-maps-api';
gmapLoader({
  key: 'xxx',
  libraries: ['places'],
  selector: '.js-map',
  streetViewControl: false,
  zoom: 12,
  marker: {
    clickable: true,
  },
});
```

Either add data attributes to the `.js-map` element or pass them in the options parameter when invoking the function

```html
<div class="js-map" data-placeId="ChIJny3vVuFTeUgR_UCehX9aS7E" data-lat="53.992792" data-lng="-1.542494"></div>
```

## Additional options

```js
{
  key: null, // API Key
  selector: '.js-map', // converts to document.querySelector(options.selector) which we will use for the map element
  libraries: ['places'], // google libs to load
  lat: null, // Hard coded latitude, taken as priority if data attribute set.
  lng: null, // Hard coded longitude, taken as priority if data attribute set.
  placeId: null, // Hard coded placeId, taken as priority if data attribute set.
  streetViewControl: false, // Turn pegman on/off
  zoom: 12, // Zoom level
  styles: null, // Add custom styles with something like snazzy maps
  markerOptions: {
    icon: null, // Path to custom marker file
    link: null, // What link will open if marker is clicked?
  },
}
```

Lastly, you will likely need to alter your webpack config. Most setups by default will not minify any ES6 code from `node_modules` so we need to make an exception for this ES6 package. Also you may as well lint it, you can't rely on a random person from the internet to make things the best way, right?

In your config where you load `.js` files:

```js
{
  test: /\.js$/,
  include: [
    path.resolve(__dirname, paths.src.js),
    path.resolve(__dirname, paths.src.entries),
  ],
  exclude: /node_modules(?!\/esm\-)/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env'],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-runtime'
    ],
  },
},
{
  test: /\.js$/,
  exclude: /node_modules(?!\/esm\-)/,
  loader: 'eslint-loader',
},
```