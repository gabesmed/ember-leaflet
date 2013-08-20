var get = Ember.get;

/**
  `EmberLeaflet.PolylineLayer` is a polyline on the map that adjusts based
  on a content object that should be an array of LatLng objects.
 
  @class PolylineLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.PolylineLayer = EmberLeaflet.ArrayGeometryLayer.extend({
  options: {},

  _newLayer: function() {
    return L.polyline(get(this, 'locations'), get(this, 'options'));
  },

  locationsDidChange: Ember.observer(function() {
    if(!this._layer) { return; }
    this._layer.setLatLngs(get(this, 'locations'));    
  }, 'locations'),

  /* On any change to the array, just update the entire leaflet path,
  as it reprocesses the whole thing anyway. */
  arrayWillChange: function(array, idx, removedCount, addedCount) {
    this.propertyWillChange('locations');
  },

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    this.propertyDidChange('locations');
  }
});

EmberLeaflet.PolygonLayer = EmberLeaflet.PolylineLayer.extend({
  _newLayer: function() {
    return L.polygon(get(this, 'locations'), get(this, 'options'));
  }
});
