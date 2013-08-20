EmberLeaflet.MarkerClusterLayer = EmberLeaflet.ContainerLayer.extend({
  options: {},

  _newLayer: function() {
    return new L.MarkerClusterGroup(this.get('options'));
  }
});
