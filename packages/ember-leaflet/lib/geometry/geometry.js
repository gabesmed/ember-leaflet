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

  destroy: function() {
    if (!this._super()) { return; }
    var content = get(this, 'content');
    if(content) { content.removeArrayObserver(this); }
    return this;
  },

  _contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content');
    if(content) { content.removeArrayObserver(this); }
  }, 'content'),

  _contentDidChange: Ember.observer(function() {
    var content = get(this, 'content');
    if(content) { content.addArrayObserver(this); }
  }, 'content')
});
