var get = Ember.get;

/**
  `EmberLeaflet.PointGeometryLayer` is a base geometry on the map that
  adjusts based on a content object that should be a LatLng object.
 
  @class PointGeometryLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.PointGeometryLayer = EmberLeaflet.GeometryLayer.extend({

  location: Ember.computed.alias('content.location'),
  
  _createLayer: function() {
    // don't create layer if we don't have a location.
    if(this._layer || !get(this, 'location')) { return; }
    this._super();    
  },

  _updateLayerOnLocationChange: Ember.observer(function() {
    var newLatLng = get(this, 'location');
      
    if(newLatLng && !this._layer) {
      this._createLayer();
    } else if(this._layer && !newLatLng) {
      this._destroyLayer();
    } else {
      var oldLatLng = this._layer && this._layer.getLatLng();
      if(oldLatLng && newLatLng && !oldLatLng.equals(newLatLng)) {
        this._layer.setLatLng(newLatLng);
      }
    }
  }, 'location')
});
