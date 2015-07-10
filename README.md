## Ember + Leaflet = Fun with maps! [![Build Status](https://secure.travis-ci.org/gabesmed/ember-leaflet.png?branch=ember-cli-es6)](http://travis-ci.org/gabesmed/ember-leaflet)

EmberLeaflet aims to make working with Leaflet layers in your Ember app as **easy, declarative and composable** as Ember's View classes make working with DOM elements.

Wherever possible, the design is analogous to Ember's View, CollectionView and ContainerView architecture. EmberLeaflet provides functionality for maps, tile layers, markers, polylines, geometry, and popups. It provides hooks wherever possible for easy extensibility into more custom Leaflet behavior.

Resources:

* Quickstart and examples at [gabesmed.github.io/ember-leaflet](http://gabesmed.github.io/ember-leaflet)
* [Class reference](http://gabesmed.github.io/ember-leaflet/docs/index.html) (YUIDoc)
* Minimal [JSFiddle](http://jsfiddle.net/3bUv8/)

## Installation

EmberLeaflet is an Ember-cli addon, so you can install it by running:

```bash
$ ember install gabesmed/ember-leaflet#ember-cli-es6
```

## Usage

You should now have access to a new component in your app.
Render the EmberLeaflet component wherever you want to render a leaflet map:

```handlebars
{{leaflet-map}}
```

Create layers and bind content declaratively in idiomatic Ember.

``` javascript
// app/components/leaflet-map.js

import EmberLeafletComponent from 'ember-leaflet/components/leaflet-map';
import MarkerCollectionLayer from 'ember-leaflet/layers/marker-collection';
import TileLayer from 'ember-leaflet/layers/tile';

export default EmberLeafletComponent.extend({
  childLayers: [
    TileLayer.extend({
      tileUrl:
        'http://{s}.tile.cloudmade.com' +
        '/{key}/{styleId}/256/' +
        '{z}/{x}/{y}.png',
      options: {
        key: 'API-key', styleId: 997
      }
    }),
    MarkerCollectionLayer.extend({
      contentBinding: 'controller'
    })
  ]
});
```

Handle events by adding functions: listeners are added and removed automatically.

``` javascript
// app/layers/my-marker-layer.js

import MarkerLayer from 'ember-leaflet/layers/marker';

export default MarkerLayer.extend({
  click: function(e) { alert('hi!'); },
  dblclick: function(e) { alert('hi again!'); }
});
```

Functionality is added to classes with mixins.

``` javascript
// app/layers/my-marker-layer.js

import MarkerLayer from 'ember-leaflet/layers/marker';
import DraggableMixin from 'ember-leaflet/mixins/draggable';

export default MarkerLayer.extend(DraggableMixin, {});
```

More examples at [gabesmed.github.io/ember-leaflet](http://gabesmed.github.io/ember-leaflet)

## Roadmap

- Better documentation
- `EmberLeaflet.GeojsonLayer` for automatic parsing of geojson.
- `Icon` and `DivIcon` classes for easy bindings to icon properties like `className` and `innerHTML`.

PRs welcome! To contribute, get in touch with @gabesmed.

## Build It

1. `git clone https://github.com/gabesmed/ember-leaflet.git`
2. `ember install`
3. `ember build`

## Running unit tests

Run `ember test`.

## Building class reference docs

Run `ember ember-cli-yuidoc`.

## Thanks

* Thanks to the contributors to [emberjs/list-view](https://github.com/emberjs/list-view), from whom I cribbed this project skeleton.
* Thanks to everyone who makes Ember a joy to work with!
* Thanks to the makers of Leaflet, hooray for maps!
