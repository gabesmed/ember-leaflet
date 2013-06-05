/**
MapView
*/
EmberLeaflet.MapView = Ember.View.extend(EmberLeaflet.LayerMixin, {
  options: {attributionControl: false},

  didInsertElement: function() {
    this._super();
    this._createLayer();
    this.setInitialViewArea();
  },

  willDestroyElement: function() {
    this._destroyLayer();
  },

  _createLayer: function() {
    this._layer = L.map(this.get('elementId'), this.get('options'));
    this._createChildLayers();
  },

  _destroyLayer: function() {
    this._destroyChildLayers();
    this._layer.destroy();
    this._layer = null;
  },

  setInitialViewArea: function() {
    if(!this.get('initialCenter') || !this.get('initialZoom')) { return; } 
    this._layer.setView(this.get('initialCenter'), this.get('initialZoom'));
  }
});
