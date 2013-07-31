// SimpleMap
SimpleMapApp = Ember.Application.create({rootElement: '#simpleMap'});
SimpleMapApp.IndexView = EmberLeaflet.MapView.extend({
  options: {zoomControl: false}
});

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
Markers = Ember.Application.create({rootElement: '#markers'});
Markers.MarkerCollectionLayer =
  EmberLeaflet.MarkerCollectionLayer.extend({
    contentBinding: 'controller'
  });

Markers.IndexView =
  EmberLeaflet.MapView.extend({
    center: L.latLng(40.7189000170401, -73.9944648742675),
    zoom: 14,
    childLayers: [
      EmberLeaflet.DefaultTileLayer,
      Markers.MarkerCollectionLayer]
  });
Markers.IndexController =
  Ember.ArrayController.extend({
    content: [
      {location: L.latLng(40.714704, -74.000108)},
      {location: L.latLng(40.714639, -73.989551)},
      {location: L.latLng(40.721372, -73.991611)}]
  });

// Rad Markers
RadMarkersApp = Ember.Application.create({rootElement: '#radMarkers'});
RadMarkersApp.MarkerLayer =
  EmberLeaflet.MarkerLayer.extend(
    EmberLeaflet.DraggableMixin,
    EmberLeaflet.PopupMixin, {
  popupContentBinding: 'content.title'
});

RadMarkersApp.MarkerCollectionLayer =
  EmberLeaflet.MarkerCollectionLayer.extend({
    content: [
      {location: L.latLng(40.712728, -74.006014), title: 'City Hall'}],
    itemLayerClass: RadMarkersApp.MarkerLayer
  });

RadMarkersApp.IndexView =
  EmberLeaflet.MapView.extend({
    childLayers: [
      EmberLeaflet.DefaultTileLayer,
      RadMarkersApp.MarkerCollectionLayer]});

// ClusteredApp
ClusteredApp = Ember.Application.create({rootElement: '#clustered'});
ClusteredApp.MarkerClusterLayer = EmberLeaflet.ContainerLayer.extend({
    childLayers: [EmberLeaflet.MarkerCollectionLayer.extend({
      content: [
        {location: L.latLng(40.714704, -74.000108)},
        {location: L.latLng(40.714639, -73.989551)},
        {location: L.latLng(40.721372, -73.991611)}]})],
    _newLayer: function() {
        return new L.MarkerClusterGroup();
    }
});

ClusteredApp.IndexView =
  EmberLeaflet.MapView.extend({
    center: L.latLng(40.7189000170401, -73.9944648742675),
    zoom: 13,
    childLayers: [
      EmberLeaflet.DefaultTileLayer,
      ClusteredApp.MarkerClusterLayer]});
