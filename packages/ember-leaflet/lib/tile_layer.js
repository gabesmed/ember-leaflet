var get = Ember.get;

/**
  `EmberLeaflet.TileLayer` is a tile set.
 
  @class TileLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.TileLayer = EmberLeaflet.Layer.extend({
  tileUrl: null,
  options: {},
  _newLayer: function() {
    return L.tileLayer(get(this, 'tileUrl'), get(this, 'options'));
  }
});
