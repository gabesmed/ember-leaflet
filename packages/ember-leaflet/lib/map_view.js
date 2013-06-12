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
        
    this._layer = L.map(this.get('elementId'), this.get('options'));
    this._setEventHandlers();
    this._createChildLayers();
    this.setInitialViewArea();
  },

  _destroyLayer: function() {
    if(!this._layer) { return; }
    this._destroyChildLayers();
    this._unsetEventHandlers();
    this._layer.remove();
    this._layer = null;
  },
  
  _setEventHandlers: function() {
    var self = this;
    this._layer.on('zoomend', this._onZoomEnd = function(e) {
      self.set('zoom', e.target.getZoom());
    });
    this._layer.on('movestart', this._onMoveStart = function(e) {
      self.set('isMoving', true);
    });
    this._layer.on('moveend', this._onMoveEnd = function(e) {
      self.set('isMoving', false);
    });
    this._layer.on('move', this._onMove = function(e) {
      var newCenter = e.target.getCenter();
      self.set('center', [newCenter.lat,newCenter.lng]);
    });
  },

  _unsetEventHandlers: function() {
    this._layer.off('zoomend', this._onZoomEnd);
    this._layer.off('movestart', this._onMoveStart);
    this._layer.off('moveend', this._onMoveEnd);
    this._layer.off('move', this._onMove);
    this._onZoomEnd = null;
    this._onMoveStart = this._onMoveStart = this._onMove = null;
  },

  setInitialViewArea: function() {
    if(!this.get('center') || !this.get('zoom')) { return; } 
    this._layer.setView(this.get('center'), this.get('zoom'));
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
