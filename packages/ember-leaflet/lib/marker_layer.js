var get = Ember.get;

/**
  `EmberLeaflet.MarkerLayer` is a leaflet marker.
 
  @class MarkerLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.MarkerLayer = EmberLeaflet.Layer.extend({
  content: null,
  options: null,

  location: Ember.required(Function),

  locationDidChange: Ember.observer(function() {
    if(get(this, 'location') && !this._layer) {
      this._createLayer();
    } else if(this._layer && !get(this, 'location')) {
      this._destroyLayer();
    } else {
      var oldLatLng = this._layer.getLatLng();
      var newLatLng = get(this, 'location');
      if(oldLatLng && newLatLng && !oldLatLng.equals(newLatLng)) {
        this._layer.setLatLng(newLatLng);
      }
    }
  }, 'location'),

  _newLayer: function() {
    return L.marker(get(this, 'location'), get(this, 'options'));
  },

  _createLayer: function() {
    if(this._layer || !get(this, 'location')) { return; }
    this._super();
    this._layer.content = get(this, 'content');
  },

  _destroyLayer: function() {
    if(!this._layer) { return; }
    this._super();
  }
});
