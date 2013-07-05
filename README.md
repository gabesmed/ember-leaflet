# EmberLeaflet [![Build Status](https://secure.travis-ci.org/gabesmed/ember-leaflet.png?branch=master)](http://travis-ci.org/gabesmed/ember-leaflet)

## Ember + Leaflet = Fun with maps!

EmberLeaflet aims to make working with Leaflet layers in your Ember app as **easy, declarative and composable** as Ember's View classes make working with DOM elements.

Wherever possible, the design is analogous to Ember's View, CollectionView and ContainerView architecture. EmberLeaflet provides functionality for maps, tile layers, markers, polylines and geometry, and popups. It provides hooks wherever possible for easy extensibility into more custom Leaflet behavior.

## Usage

A simple map in Ember - only one line of code!

``` javascript
App.MapView = EmberLeaflet.MapView.extend({});
```

Specify center, zoom and options:

``` javascript
App.MapView = EmberLeaflet.MapView.extend({
    center: L.latLng(40.713282, -74.006978),
    zoom: 18,
    options: {maxZoom: 19, minZoom: 0}    
});
```

Customize tiles:

``` javascript
App.TileLayer = EmberLeaflet.TileLayer.extend({
    tileUrl: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
    options: {key: 'API-key', styleId: 997}
});

App.MapView = EmberLeaflet.MapView.extend({
    childLayers: [App.TileLayer]
});
```

Add some markers:

``` javascript
App.MarkerCollectionLayer = EmberLeaflet.MarkerCollectionLayer.extend({
    content: [
        {location: L.latLng(40.713282, -74.006978)},
        {location: L.latLng(40.713465, -74.006753)},
        {location: L.latLng(40.713873, -74.006404)}]
});

App.MapWithMarkersView = EmberLeaflet.MapView.extend({
    childLayers: [
        App.TileLayer,
        App.MarkerCollectionLayer]
});
```

Bind to a controller, and markers are added, removed, and moved based on their content binding.

``` javascript
App.MarkerCollectionLayer = EmberLeaflet.MarkerCollectionLayer.extend({
    contentBinding: 'controller'
});

App.MapWithBoundMarkersView = EmberLeaflet.MapView.extend({
    childLayers: [
        App.TileLayer,
        App.MarkerCollectionLayer]
});

App.MapWithBoundMarkersController = Ember.ArrayController.extend({
    content: [
        {location: L.latLng(40.713282, -74.006978)},
        {location: L.latLng(40.713465, -74.006753)},
        {location: L.latLng(40.713873, -74.006404)}]
});
```

Add functionality to marker class with mixins.

``` javascript
App.DraggableMarker = EmberLeaflet.MarkerLayer.extend(
    EmberLeaflet.DraggableMixin, {});

App.MarkerWithPopup = EmberLeaflet.MarkerLayer.extend(
        EmberLeaflet.PopupMixin, {
    popupContent: Ember.computed.alias('content.title'),
    popupOptions: {offset: L.point(0, -36)}
});
```

Customizing marker class:

``` javascript
App.MarkerLayer = EmberLeaflet.MarkerLayer.extend({
    icon: L.DivIcon.extend({
        iconSize: [40, 40]
    }),
    options: function() {
        return {
            html: this.get('content.title'),
            icon: this.get('icon')
        };
    }.property()
});

App.TitledMarkerCollectionLayer = EmberLeaflet.MarkerCollectionLayer.extend({
    content: [
        {location: L.latLng(40.713282, -74.006978), title: 'Gas'},
        {location: L.latLng(40.713465, -74.006753), title: 'Café'},
        {location: L.latLng(40.713873, -74.006404), title: 'ATM'}],
    itemLayerClass: App.MarkerLayer
});
```

Create your own tile layers:

``` javascript
App.TileLayer = EmberLeaflet.Layer.extend({
    _newLayer: function() {
        return L.TileJSON.createTileLayer(myTileJson);
    }  
});
```

Incorporate other leaflet layer classes:

``` javascript
App.MarkerClusterLayer = EmberLeaflet.Layer.extend({
    options: {disableClusteringAtZoom: 16, showCoverageOnHover: false},
    childLayers: [App.MarkerCollectionLayer],
    _newLayer: function() {
        return new L.MarkerClusterGroup(this.get('options'));
    }
});

App.MapWithClusteredMarkersView = EmberLeaflet.MapView.extend({
    childLayers: [
        App.TileLayer,
        App.MarkerClusterLayer]
});
```

## Build It

1. `git clone https://github.com/gabesmed/ember-leaflet.git`
2. `bundle`
3. `bundle exec rake dist`
4. `cp dist/modules/ember-leaflet.js myapp/`

## Running unit tests

Run ```bundle exec rackup``` and open [http://localhost:9292](http://localhost:9292) in a browser.

## Thanks

* Thanks to the contributors to [emberjs/list-view](https://github.com/emberjs/list-view), from whom I cribbed this project skeleton.
* Thanks to everyone who makes Ember a joy to work with!
* Thanks to the makers of Leaflet, hooray for maps!
* Thanks to `miguelcobain`, whose [ember-leaflet library](https://github.com/miguelcobain/ember-leaflet) was the inspiration to polish and publish this one.
