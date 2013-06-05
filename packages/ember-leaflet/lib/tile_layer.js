EmberLeaflet.TileLayer = EmberLeaflet.Layer.extend({
  tilejson: null,
  _newLayer: function() {
    Ember.assert("Must have tilejson", !!this.get('tilejson'));
    return L.TileJSON.createTileLayer(this.get('tilejson'));
  }
});
