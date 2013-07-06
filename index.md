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
    options: {maxZoom: 19, minZoom: 0}    
  });
```

Customize tiles:

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
    options: {key: 'API-key', styleId: 997}
  });

CustomTilesApp.IndexView =
  EmberLeaflet.MapView.extend({
    childLayers: [CustomTilesApp.TileLayer]
  });
```

Add some markers:

{% assign ember_app = "markers" %}
{% include ember_app.liquid %}

``` javascript
MarkersApp = Ember.Application.create();
MarkersApp.MarkerCollectionLayer =
  EmberLeaflet.MarkerCollectionLayer.extend({
    content: [
      {location: L.latLng(40.71328, -74.00697)},
      {location: L.latLng(40.71346, -74.00675)},
      {location: L.latLng(40.71387, -74.00640)}]
  });

MarkersApp.IndexView =
  EmberLeaflet.MapView.extend({
    childLayers: [
      EmberLeaflet.DefaultTileLayer,
      MarkersApp.MarkerCollectionLayer]
  });

```

Bind to a controller, and markers are added, removed, and moved based on their content binding.

{% assign ember_app = "boundMarkers" %}
{% include ember_app.liquid %}

``` javascript
BoundMarkersApp = Ember.Application.create();
BoundMarkersApp.MarkerCollectionLayer =
  EmberLeaflet.MarkerCollectionLayer.extend({
    contentBinding: 'controller'
  });

BoundMarkersApp.IndexView =
  EmberLeaflet.MapView.extend({
    childLayers: [
      EmberLeaflet.DefaultTileLayer,
      BoundMarkersApp.MarkerCollectionLayer]
  });
BoundMarkersApp.IndexController =
  Ember.ArrayController.extend({
    content: [
      {location: L.latLng(40.71328, -74.00697)},
      {location: L.latLng(40.71346, -74.00675)},
      {location: L.latLng(40.71387, -74.00640)}]
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
