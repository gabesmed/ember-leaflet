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

  /**
  Should override this binding with a reference to the location property
  of the content object.
  */
  location: Ember.computed.alias('content.location'),

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
  }, 'location'),

  _newLayer: function() {
    return L.marker(get(this, 'location'), get(this, 'options'));
  },

  _createLayer: function() {
    if(this._layer || !get(this, 'location')) { return; }
    this._super();
    this._layer.content = get(this, 'content');

    // Add a notification for layer changing on the onAdd function.
    var oldAdd = this._layer.onAdd, self = this;
    this._layer.onAdd = function() {
      self.propertyWillChange('layer');
      oldAdd.apply(this, arguments);
      self.propertyDidChange('layer');
    };
    this.notifyPropertyChange('layer');
  },

  _destroyLayer: function() {
    if(!this._layer) { return; }
    this._super();
  }
});
