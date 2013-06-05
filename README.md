# EmberLeaflet [![Build Status](https://secure.travis-ci.org/gabesmed/ember-leaflet.png?branch=master)](http://travis-ci.org/gabesmed/ember-leaflet)

Ember + Leaflet = Fun with maps!

This is a work in progress. More tests and functionality coming soon.

## Usage

A simple map:

``` javascript
App.TileLayer = EmberLeaflet.TileLayer.extend({
    tileUrl: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
    options: {key: 'API-key', styleId: 997}
});

App.MapView = EmberLeaflet.MapView.extend({
    options: {maxZoom: 19, minZoom: 0, attributionControl: false},
    childLayers: [App.TileLayer]
});
```

Adding markers:

``` javascript
App.MarkerCollectionLayer = EmberLeaflet.MarkerCollectionLayer.extend({
    content: [
        {location: L.latLng(42, 14)},
        {location: L.latLng(43, 13)},
        {location: L.latLng(44, 12)}
    ]
});

App.MapWithMarkersView = EmberLeaflet.MapView.extend({
    options: {maxZoom: 19, minZoom: 0, attributionControl: false},
    childLayers: [
        App.TileLayer,
        App.MarkerCollectionLayer]
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

App.MarkerCollectionLayer.reopenClass({
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
        return new L.MarkerClusterGroup(get(this, 'options'));
    }
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
