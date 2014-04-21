## Ember + Leaflet = Fun with maps! [![Build Status](https://secure.travis-ci.org/gabesmed/ember-leaflet.png?branch=master)](http://travis-ci.org/gabesmed/ember-leaflet)

EmberLeaflet aims to make working with Leaflet layers in your Ember app as **easy, declarative and composable** as Ember's View classes make working with DOM elements.

Wherever possible, the design is analogous to Ember's View, CollectionView and ContainerView architecture. EmberLeaflet provides functionality for maps, tile layers, markers, polylines and geometry, and popups. It provides hooks wherever possible for easy extensibility into more custom Leaflet behavior.

Full docs and live examples at [gabesmed.github.io/ember-leaflet](http://gabesmed.github.io/ember-leaflet). Also see the minimal [JSFiddle](http://jsfiddle.net/3bUv8/)

## Usage

Creating a map is just one line of code!

``` javascript
App.AMapView = EmberLeaflet.MapView.extend({});
```

Create layers and bind content declaratively in idiomatic Ember.

``` javascript
App.AnotherMapView = EmberLeaflet.MapView.extend({
    childLayers: [
        App.TileLayer,
        EmberLeaflet.MarkerCollectionLayer.extend({
            contentBinding: 'controller'
        })]
});
```

Handle events by adding functions: listeners are added and removed automatically.

``` javascript
App.MarkerLayer = EmberLeaflet.MarkerLayer.extend({
    click: function(e) { alert('hi!'); },
    dblclick: function(e) { alert('hi again!'); }
});
```

Functionality is added to classes with mixins.

``` javascript
App.DraggableMarker = EmberLeaflet.MarkerLayer.extend(
    EmberLeaflet.DraggableMixin, {});
```

More examples at [gabesmed.github.io/ember-leaflet](http://gabesmed.github.io/ember-leaflet)

## Roadmap

- Better documentation and JSDoc auto-generation
- `EmberLeaflet.GeojsonLayer` for automatic parsing of geojson.
- `popupViewClass` for including Ember Views in popups.
- `Icon` and `DivIcon` classes for easy bindings to icon properties like `className` and `innerHTML`.

PRs welcome! To contribute, get in touch with @gabesmed.

## Build It

1. `git clone https://github.com/gabesmed/ember-leaflet.git`
2. `bundle`
3. `bundle exec rake dist`
4. `cp dist/modules/ember-leaflet.js myapp/`

## Running unit tests

Run `bundle exec rackup` and open [http://localhost:9292](http://localhost:9292) in a browser.

## Thanks

* Thanks to the contributors to [emberjs/list-view](https://github.com/emberjs/list-view), from whom I cribbed this project skeleton.
* Thanks to everyone who makes Ember a joy to work with!
* Thanks to the makers of Leaflet, hooray for maps!

## Install notes

For linux installs, the most common missing dependencies are libsxlt-dev, libxml2-dev, and ruby1.9.1-dev or ruby1.8-dev. If something goes wrong, first make sure you have these installed.
