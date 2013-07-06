// SimpleMap
SimpleMapApp = Ember.Application.create({rootElement: '#simpleMap'});
SimpleMapApp.IndexView = EmberLeaflet.MapView.extend({});

// CenteredMap
CenteredMapApp = Ember.Application.create({rootElement: '#centeredMap'});
CenteredMapApp.IndexView = EmberLeaflet.MapView.extend({
    center: L.latLng(40.713282, -74.006978),
    zoom: 18,
    options: {maxZoom: 19, minZoom: 0}
});

// CustomTiles
CustomTilesApp = Ember.Application.create({rootElement: '#customTiles'});
CustomTilesApp.TileLayer = EmberLeaflet.TileLayer.extend({
    tileUrl: 'http://{s}.tile.cloudmade.com/8ee2a50541944fb9bcedded5165f09d9/{styleId}/256/{z}/{x}/{y}.png',
    options: {key: 'API-key', styleId: 997}
});
CustomTilesApp.IndexView = EmberLeaflet.MapView.extend({
    childLayers: [CustomTilesApp.TileLayer]
});

// Markers
MarkersApp = Ember.Application.create({rootElement: '#markers'});
MarkersApp.MarkerCollectionLayer = EmberLeaflet.MarkerCollectionLayer.extend({
    content: [
        {location: L.latLng(40.713282, -74.006978)},
        {location: L.latLng(40.713465, -74.006753)},
        {location: L.latLng(40.713873, -74.006404)}]
});

MarkersApp.IndexView = EmberLeaflet.MapView.extend({
    childLayers: [
        EmberLeaflet.DefaultTileLayer,
        MarkersApp.MarkerCollectionLayer]
});

//BoundMarkers
BoundMarkersApp = Ember.Application.create({rootElement: '#boundMarkers'});
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
      {location: L.latLng(40.713282, -74.006978)},
      {location: L.latLng(40.713465, -74.006753)},
      {location: L.latLng(40.713873, -74.006404)}]
  });
