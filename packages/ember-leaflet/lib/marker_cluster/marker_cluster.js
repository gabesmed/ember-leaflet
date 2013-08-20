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
  }
});
