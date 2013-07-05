/**
  `EmberLeaflet.MapView` is an `Ember.View` object present in the DOM, and
  also instantiates a Leaflet map inside.
 
  @class MapView
  @namespace EmberLeaflet
  @extends EmberLeaflet.ContainerLayerMixin
*/

var DEFAULT_CENTER = L.latLng(40.713282, -74.006978);
var DEFAULT_TILE_URL = 'http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png';

function createDefaultTileLayer() { return L.tileLayer(DEFAULT_TILE_URL); }

EmberLeaflet.MapView = Ember.View.extend(EmberLeaflet.ContainerLayerMixin, {
  options: {},
  center: DEFAULT_CENTER,
  zoom: 16,
  
  isMoving: false,
  isZooming: false,

  didInsertElement: function() {
    this._super();
    this._createLayer();
  },

  willDestroyElement: function() {
    this._destroyLayer();
  },

  _createLayer: function() {
    if(this._layer) { return; }
    Ember.assert("Center must be set before creating map, was " +
      this.get('center'), !!this.get('center'));
    Ember.assert("Zoom must be set before creating map, was " + 
      this.get('zoom'), !!this.get('zoom'));
    this.willCreateLayer();
    this.propertyWillChange('layer');
    this._layer = L.map(this.get('elementId'), this.get('options'));
    this._layer.setView(this.get('center'), this.get('zoom'));
    this._addEventListeners();
    this.propertyDidChange('layer');
    this.didCreateLayer();
    if(!this._childLayers.length) {
      this._defaultChildLayer = createDefaultTileLayer();
      this._layer.addLayer(this._defaultChildLayer);
    }
  },

  _destroyLayer: function() {
    this.willDestroyLayer();
    this.propertyWillChange('layer');
    if(!this._layer) { return; }
    if(this._defaultChildLayer) {
      this._layer.removeLayer(this._defaultChildLayer);
      this._defaultChildLayer = null;
    }
    this._removeEventListeners();
    this._layer.remove();
    this._layer = null;
    this.propertyDidChange('layer');
    this.didDestroyLayer();
  },
  
  _addEventListeners: function() {
    this._layer.on('zoomstart', this._onZoomStart, this);
    this._layer.on('zoomend', this._onZoomEnd, this);
    this._layer.on('movestart', this._onMoveStart, this);
    this._layer.on('moveend', this._onMoveEnd, this);
    this._layer.on('move', this._onMove, this);
  },

  _removeEventListeners: function() {
    this._layer.off('zoomstart', this._onZoomStart, this);
    this._layer.off('zoomend', this._onZoomEnd, this);
    this._layer.off('movestart', this._onMoveStart, this);
    this._layer.off('moveend', this._onMoveEnd, this);
    this._layer.off('move', this._onMove, this);
  },

  _onZoomStart: function(e) {
    this.set('isZooming', true);
  },

  _onZoomEnd: function(e) {
    this.setProperties({isZooming: false, zoom: this._layer.getZoom()});
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
    if(!this._layer) { return; }
    this._layer.setZoom(this.get('zoom'));
  }, 'zoom'),
  
  centerDidChange: Ember.observer(function() {
    if (!this._layer || this.get('isMoving')) { return; }
    this._layer.panTo(this.get('center'));
  }, 'center')
});
