require("ember-leaflet/geometry/geometry");

var get = Ember.get;

/**
  `EmberLeaflet.ArrayGeometryLayer` is a base geometry on the map that
  adjusts based on a content object that should be an array of
  LatLng objects.
 
  @class ArrayGeometryLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.ArrayGeometryLayer = EmberLeaflet.Layer.extend({
  init: function() {
    this._super();
    this._contentDidChange();
    this._addLocationsPropertyObserver();
  },

  /**
  If this property is null, watch the content object for location updates.
  If this property is set, look inside this property of the content object
  for the locations array.
  */
  locationsProperty: null,

  destroy: function() {
    this._contentWillChange();
    return this._super();
  },

  _contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content');
    if(!content) { return; }
    var locationsProperty = get(this, 'locationsProperty'),
      arr = locationsProperty ? get(content, locationsProperty) : content;
    if(arr) { arr.removeArrayObserver(this); }
  }, 'content', 'locationsProperty'),

  _contentDidChange: Ember.observer(function() {
    var content = get(this, 'content');
    if(!content) { return; }
    var locationsProperty = get(this, 'locationsProperty'),
      arr = locationsProperty ? get(content, locationsProperty) : content;
    if(arr) { arr.addArrayObserver(this); }
  }, 'content', 'locationsProperty'),

  _addLocationsPropertyObserver: function() {
    var locationsProperty = get(this, 'locationsProperty');
    if (!locationsProperty) { return; }
    this.addObserver('content.' + locationsProperty, this, function() {
      this.notifyPropertyChange('locations');
    });
  }
});

/**
  `EmberLeaflet.PointGeometryLayer` is a base geometry on the map that
  adjusts based on a content object that should be a LatLng object.
 
  @class PointGeometryLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.PointGeometryLayer = EmberLeaflet.Layer.extend({

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
  }, 'location')
});
