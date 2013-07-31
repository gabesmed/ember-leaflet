---
layout: default
title: Ember-Leaflet
---
# Ember + Leaflet = Fun with maps!

EmberLeaflet aims to make working with [Leaflet](http://leafletjs.com) layers in your Ember app as **easy, declarative and composable** as [Ember](http://emberjs.com)'s View classes make working with DOM elements.

Wherever possible, the design is analogous to Ember's View, CollectionView and ContainerView architecture. EmberLeaflet provides Ember integrations for maps, tile layers, markers, polylines and geometry, and popups. It provides hooks wherever possible for easy extensibility into more custom Leaflet behavior.

## Usage

A simple map in Ember - only two lines of code!

{% assign ember_app = "simpleMap" %}
{% include ember_app.liquid %}

``` javascript
SimpleMapApp = Ember.Application.create();
SimpleMapApp.IndexView = 
  EmberLeaflet.MapView.extend({});
```

Specify center, zoom and options:

{% assign ember_app = "centeredMap" %}
{% include ember_app.liquid %}

``` javascript
CenteredMapApp = Ember.Application.create();
CenteredMapApp.IndexView = 
  EmberLeaflet.MapView.extend({
    center: L.latLng(40.713282, -74.006978),
    zoom: 18,
    options: {maxZoom: 19, minZoom: 0}});
```

Customize the tile source:

{% assign ember_app = "customTiles" %}
{% include ember_app.liquid %}

``` javascript
CustomTilesApp = Ember.Application.create();
CustomTilesApp.TileLayer =
  EmberLeaflet.TileLayer.extend({
    tileUrl:
      'http://{s}.tile.cloudmade.com' +
      '/{key}/{styleId}/256/' +
      '{z}/{x}/{y}.png',
    options: {key: 'API-key', styleId: 997}});

CustomTilesApp.IndexView =
  EmberLeaflet.MapView.extend({
    childLayers: [CustomTilesApp.TileLayer]});
```

Add some markers! Bind a `MarkerCollectionLayer`'s content to a controller, and markers are added, removed, and moved based on their content binding.

{% assign ember_app = "markers" %}
{% include ember_app.liquid %}

``` javascript
MarkersApp = Ember.Application.create();
MarkersApp.MarkerCollectionLayer =
  EmberLeaflet.MarkerCollectionLayer.extend({
    contentBinding: 'controller'});

MarkersApp.IndexView =
  EmberLeaflet.MapView.extend({
    childLayers: [
      EmberLeaflet.DefaultTileLayer,
      MarkersApp.MarkerCollectionLayer]});

MarkersApp.IndexController =
  Ember.ArrayController.extend({
    content: [
      {location: L.latLng(40.714, -74.000)},
      {location: L.latLng(40.714, -73.989)},
      {location: L.latLng(40.721, -73.991)}]});
```

Add functionality to EmberLeaflet classes with mixins.

{% assign ember_app = "radMarkers" %}
{% include ember_app.liquid %}

``` javascript
RadMarkersApp = Ember.Application.create();
RadMarkersApp.MarkerLayer =
  EmberLeaflet.MarkerLayer.extend(
    EmberLeaflet.DraggableMixin,
    EmberLeaflet.PopupMixin, {
  popupContentBinding: 'content.title'
});

RadMarkersApp.MarkerCollectionLayer =
  EmberLeaflet.MarkerCollectionLayer.extend({
    content: [{
      location: L.latLng(40.7127, -74.0060),
      title: 'City Hall'}],
    itemLayerClass: RadMarkersApp.MarkerLayer
  });

RadMarkersApp.IndexView =
  EmberLeaflet.MapView.extend({
    childLayers: [
      EmberLeaflet.DefaultTileLayer,
      RadMarkersApp.MarkerCollectionLayer]});
```

Easily incorporate 3rd-party leaflet classes into your Ember app.

{% assign ember_app = "clustered" %}
{% include ember_app.liquid %}

``` javascript
ClusteredApp = Ember.Application.create();
ClusteredApp.MarkerCollectionLayer =
  EmberLeaflet.MarkerCollectionLayer.extend({
    content: [
      {location: L.latLng(40.714, -74.000)},
      {location: L.latLng(40.714, -73.989)},
      {location: L.latLng(40.721, -73.991)}]});

ClusteredApp.MarkerClusterLayer =
  EmberLeaflet.ContainerLayer.extend({
    childLayers: [
      ClusteredApp.MarkerCollectionLayer],
    _newLayer: function() {
      return new L.MarkerClusterGroup(); }
});

ClusteredApp.IndexView =
  EmberLeaflet.MapView.extend({
    childLayers: [
      EmberLeaflet.DefaultTileLayer,
      ClusteredApp.MarkerClusterLayer]});
```

## Use it

Add `ember-leaflet.js` to your app, after `ember.js` and `leaflet-src.js`. Make sure to include the `leaflet.css` stylesheet as well!

## Build It

1. `git clone https://github.com/gabesmed/ember-leaflet.git`
2. `bundle install`
3. `rake dist`
4. `open dist/modules/ember-leaflet.js`

## Running unit tests

Run `rackup` and open [http://localhost:9292](http://localhost:9292) in a browser. Or, `rake test`.

## Thanks

* Thanks to the contributors to [emberjs/list-view](https://github.com/emberjs/list-view), from whom I cribbed this project skeleton.
* Thanks to everyone who makes Ember a joy to work with!
* Thanks to the makers of Leaflet, hooray for maps!
