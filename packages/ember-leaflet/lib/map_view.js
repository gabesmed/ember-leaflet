/**
  `EmberLeaflet.MapView` is an `Ember.View` object present in the DOM, and
  also instantiates a Leaflet map inside.
 
  @class MapView
  @namespace EmberLeaflet
  @extends EmberLeaflet.LayerMixin
*/
EmberLeaflet.MapView = Ember.View.extend(EmberLeaflet.LayerMixin, {
  options: {attributionControl: false},
  isMoving: false,

  didInsertElement: function() {
    this._super();
    this._createLayer();
  },

  willDestroyElement: function() {
    this._destroyLayer();
  },

  _createLayer: function() {
    if(this._layer) { return; }
    Ember.assert("Center and zoom must be set before creating map.",
      !!this.get('center') && !!this.get('zoom'));
    this._layer = L.map(this.get('elementId'), this.get('options'));
    this._layer.setView(this.get('center'), this.get('zoom'));
    this._setEventHandlers();
    this._createChildLayers();
  },

  _destroyLayer: function() {
    if(!this._layer) { return; }
    this._destroyChildLayers();
    this._unsetEventHandlers();
    this._layer.remove();
    this._layer = null;
  },
  
  _setEventHandlers: function() {
    this._layer.on('zoomend', this._onZoomEnd, this);
    this._layer.on('movestart', this._onMoveStart, this);
    this._layer.on('moveend', this._onMoveEnd, this);
    this._layer.on('move', this._onMove, this);
  },

  _unsetEventHandlers: function() {
    this._layer.off('zoomend', this._onZoomEnd, this);
    this._layer.off('movestart', this._onMoveStart, this);
    this._layer.off('moveend', this._onMoveEnd, this);
    this._layer.off('move', this._onMove, this);
  },

  _onZoomEnd: function(e) {
    this.set('zoom', this._layer.getZoom());
  },

  _onMoveStart: function(e) {
    this.set('isMoving', true);
  },

  _onMoveEnd: function(e) {
    this.set('isMoving', false);
  },

  _onMove: function(e) {
    this.set('center', this._layer.getCenter());    
  },

  zoomDidChange: Ember.observer(function() {
    if(!this._layer || !this.get('zoom')) { return; }
    this._layer.queueZoom(this.get('zoom'));
  }, 'zoom'),
  
  centerDidChange: Ember.observer(function() {
    if(!this._layer || !this.get('center')) { return; }
    var center = this.get('center');
    if (!this.get('isMoving')) {
      this._layer.panTo(this.get('center'));
    }
  }, 'center')
});
