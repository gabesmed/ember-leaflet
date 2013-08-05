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
  },

  /**
  If this property is null, watch the content object for location updates.
  If this property is set, look inside this property of the content object
  for the locations array.
  */
  locationsProperty: null,

  destroy: function() {
    this._contentWillChange();
    if (!this._super()) { return; }
    return this;
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
  }, 'content', 'locationsProperty')
});
