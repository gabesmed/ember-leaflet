/**
  `EmberLeaflet.MapView` is an `Ember.View` object present in the DOM, and
  also instantiates a Leaflet map inside.
 
  @class MapView
  @namespace EmberLeaflet
  @extends EmberLeaflet.LayerMixin
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
    if(this._layer) { return; }
    this._layer = L.map(this.get('elementId'), this.get('options'));
    this._createChildLayers();
  },

  _destroyLayer: function() {
    if(!this._layer) { return; }
    this._destroyChildLayers();
    this._layer.destroy();
    this._layer = null;
  },

  setInitialViewArea: function() {
    if(!this.get('center') || !this.get('zoom')) { return; } 
    this._layer.setView(this.get('center'), this.get('zoom'));
  }
});
