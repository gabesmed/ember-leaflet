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
  },

  willDestroyElement: function() {
    this._destroyLayer();
  },

  _createLayer: function() {
    if(this._layer) { return; }
    
    /*
     * Queue zoom transitions
     */
    if (L.DomUtil.TRANSITION) {
        L.Map.addInitHook(function() {
            L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, function() {
                var zoom = this._zoomActions.shift();
                if (zoom !== undefined) {
                    this.setZoom(zoom);
                }
            }, this);
        });
    }
    
    L.Map.include(!L.DomUtil.TRANSITION ? {} : {
        _zoomActions : [],
        queueZoom : function(zoom) {
            if (this._animatingZoom) {
                this._zoomActions.push(zoom);
            } else {
                this.setZoom(zoom);
            }
        }
    });
    
    this._layer = L.map(this.get('elementId'), this.get('options'));
    this._setEventHandlers();
    this._createChildLayers();
    this.setInitialViewArea();
  },

  _destroyLayer: function() {
    if(!this._layer) { return; }
    this._destroyChildLayers();
    this._layer.remove();
    this._layer = null;
  },
  
  _setEventHandlers: function(){
    var self = this;
    this._layer.on('zoomend', function(e) {
      self.set('zoom', e.target.getZoom());
    });
    this._layer.on('movestart', function(e) {
      self.set('moving', true);
    });
    this._layer.on('moveend', function(e) {
      self.set('moving', false);
    });
    this._layer.on('move', function(e) {
      var newCenter = e.target.getCenter();
      self.set('center', [newCenter.lat,newCenter.lng]);
    });
  },

  setInitialViewArea: function() {
    if(!this.get('center') || !this.get('zoom')) { return; } 
    this._layer.setView(this.get('center'), this.get('zoom'));
  },

  zoomDidChange: function(){
    if(!this._layer || !this.get('zoom')) { return; }
    this._layer.queueZoom(this.get('zoom'));
  }.observes('zoom'),
  
  centerDidChange: function(){
    if(!this._layer || !this.get('center')) { return; }
    var center = this.get('center');
    if (!this.get('moving')) {
      this._layer.panTo(this.get('center'));
    }
  }.observes('center')
});
