EmberLeaflet.MarkerClusterLayer = EmberLeaflet.ContainerLayer.extend({
  options: {},

  /** Special value for detecting clustering. This is important as the
  cluster won't update when a marker inside it is moved, so we need to
  make sure to delete and re-create markers when they are inside a cluster
  as opposed to just moving them.
  */
  _isCluster: true,

  _newLayer: function() {
    Ember.assert("Leaflet.cluster must be loaded.", !!L.MarkerClusterGroup);
    return new L.MarkerClusterGroup(this.get('options'));
  },

  _removeChild: function(layer) {
    this._layer.removeLayer(layer);
    // If the marker still has a map, it's because it wasn't clustered --
    // it was directly on the map. So we need to remove it from there
    // as well.
    if(layer._map) { layer._map.removeLayer(layer); }
  }
});
