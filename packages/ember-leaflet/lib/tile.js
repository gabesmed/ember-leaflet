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
  },

  tileUrlDidChange: Ember.observer(function() {
    if(!this._layer) { return; }
    this._layer.setUrl(this.get('tileUrl'));
  }, 'tileUrl'),

  zIndex: EmberLeaflet.computed.optionProperty(),
  opacity: EmberLeaflet.computed.optionProperty()
});

EmberLeaflet.DefaultTileLayer = EmberLeaflet.TileLayer.extend({
  tileUrl: '//a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png'
});
