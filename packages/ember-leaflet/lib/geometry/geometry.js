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

  locationsProperty: null,

  destroy: function() {
    if (!this._super()) { return; }
    var content = get(this, 'content');
    if(content) {
      var locationsProperty = get(this, 'locationsProperty');
      if(locationsProperty) {
        get(content, locationsProperty).removeArrayObserver(this);
      } else { content.removeArrayObserver(this); }
    }
    return this;
  },

  _contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content');
    if(content) {
      var locationsProperty = get(this, 'locationsProperty');
      if(locationsProperty) {
        get(content, locationsProperty).removeArrayObserver(this);
      } else { content.removeArrayObserver(this); }
    }
  }, 'content'),

  _contentDidChange: Ember.observer(function() {
    var content = get(this, 'content');
    if(content) {
      var locationsProperty = get(this, 'locationsProperty');
      if(locationsProperty) {
        get(content, locationsProperty).addArrayObserver(this);
      } else { content.addArrayObserver(this); }
    }
  }, 'content')
});
