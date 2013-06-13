(function() {
EmberLeaflet = Ember.Namespace.create();

})();



(function() {
var fmt = Ember.String.fmt;

/**
  `EmberLeaflet.LayerMixin` provides basic functionality for the Ember
  wrapper of Leaflet layers, including instantiating child and parent layers.
 
  @class LayerMixin
  @namespace EmberLeaflet
*/
EmberLeaflet.LayerMixin = Ember.Mixin.create({
  _layer: null,
  _parentLayer: null,
  _childLayers: [],

  // childLayers: Ember.computed(function() {
  //   return this._childLayers; }).property(),
  
  layer: Ember.computed(function() {
    return this._layer; }).property(),

  parentLayer: Ember.computed(function() {
    return this._parentLayer; }).property(),

  _newLayer: Ember.required(Function),

  parentLayerWillChange: Ember.beforeObserver(function() {
    if(this.get('parentLayer')) { this._destroyLayer(); }
  }, 'parentLayer'),

  parentLayerDidChange: Ember.observer(function() {
    if(this.get('parentLayer')) { this._createLayer(); }
  }, 'parentLayer'),

  _createLayer: function() {
    Ember.assert("Layer must not already be created.", !this._layer);
    Ember.assert("Layer must have a parent", !!this.get('parentLayer'));
    Ember.assert("Parent layer must be in leaflet.",
      !!this.get('parentLayer')._layer);
    this.propertyWillChange('layer');
    this._layer = this._newLayer();
    this.propertyDidChange('layer');
    Ember.assert("Layer must have Leaflet methods.",
      typeof this._layer.onAdd === 'function');
    this.get('parentLayer')._layer.addLayer(this._layer);
    this._createChildLayers();
  },

  _destroyLayer: function() {
    Ember.assert("Layer must exist.", !!this._layer);
    this._destroyChildLayers();
    this.propertyWillChange('layer');
    this.get('parentLayer')._layer.removeLayer(this._layer);
    this._layer = null;
    this.propertyDidChange('layer');
  },

  _createChildLayers: function() {
    Ember.assert(
      fmt("%@ layer must support adding objects.", this.toString()),
      (typeof this._layer.addLayer === 'function' ||
      !this._childLayers.length));
    var childLayerClasses = this.get('childLayers') || [], self = this;
    this._childLayers = childLayerClasses.map(function(layerClass) {
      return self._createChildLayer(layerClass);
    });
  },

  _createChildLayer: function(layerClass, options) {
    options = Ember.$.extend({
      controller: this.get('controller'),
      _parentLayer: this
    }, options || {});
    var layerInstance;
    var layerType = Ember.typeOf(layerClass);
    Ember.assert(
      fmt("layerClass %@ must be an Ember instance or class.",
        layerClass ? layerClass.toString() : '<undefined>'),
        layerType === 'instance' || layerType === 'class');
    if(layerType === 'instance') {
      layerInstance = layerClass;
      layerInstance.setProperties(options);
    } else if (layerType === 'class'){
      layerInstance = layerClass.create(options);
    }
    layerInstance.propertyDidChange('parentLayer');
    return layerInstance;
  },

  _destroyChildLayers: function() {
    this._childLayers.forEach(function(layer) {
      layer._destroyLayer();
      layer.destroy();
    });
    this._childLayers = [];
  }
});

/**
  `EmberLeaflet.Layer` is a convenience object for those who prefer
  creating layers with `EmberLeaflet.Layer.extend(...)` rather than
  `Ember.Object.extend(EmberLeaflet.LayerMixin, ...)`.
 
  @class Layer
  @namespace EmberLeaflet
*/
EmberLeaflet.Layer = Ember.Object.extend(EmberLeaflet.LayerMixin, {});

/**
  `EmberLeaflet.EmptyLayer` is a null layer mostly for testing.
 
  @class EmptyLayer
  @namespace EmberLeaflet
*/
EmberLeaflet.EmptyLayer = EmberLeaflet.Layer.extend({
  _newLayer: function() { return L.layerGroup([]); }
});

})();



(function() {
/**
  `EmberLeaflet.MapView` is an `Ember.View` object present in the DOM, and
  also instantiates a Leaflet map inside.
 
  @class MapView
  @namespace EmberLeaflet
  @extends EmberLeaflet.LayerMixin
*/

var DEFAULT_CENTER = L.latLng(40.713282, -74.006978);
var DEFAULT_TILE_URL = 'http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png';

function createDefaultTileLayer() { return L.tileLayer(DEFAULT_TILE_URL); }

EmberLeaflet.MapView = Ember.View.extend(EmberLeaflet.LayerMixin, {
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
    this._layer = L.map(this.get('elementId'), this.get('options'));
    this._layer.setView(this.get('center'), this.get('zoom'));
    this._addEventListeners();
    this._createChildLayers();
    if(!this._childLayers.length) {
      this._defaultChildLayer = createDefaultTileLayer();
      this._layer.addLayer(this._defaultChildLayer);
    }    
  },

  _destroyLayer: function() {
    if(!this._layer) { return; }
    this._destroyChildLayers();
    if(this._defaultChildLayer) {
      this._layer.removeLayer(this._defaultChildLayer);
      this._defaultChildLayer = null;
    }
    this._removeEventListeners();
    this._layer.remove();
    this._clearEventHandlers();
    this._layer = null;
  },
  
  _addEventListeners: function() {
    this._layer.on('zoomstart', this._onZoomStart, this);
    this._layer.on('zoomend', this._onZoomEnd, this);
    this._layer.on('movestart', this._onMoveStart, this);
    this._layer.on('moveend', this._onMoveEnd, this);
    this._layer.on('move', this._onMove, this);
  },
  
  _clearEventHandlers: function(){
    this._layer.off('zoomend');
    this._layer.off('movestart');
    this._layer.off('moveend');
    this._layer.off('move');
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

})();



(function() {
var get = Ember.get;

/**
  `EmberLeaflet.TileLayer` is a tile set.
 
  @class TileLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.TileLayer = EmberLeaflet.Layer.extend({
  tileUrl: null,
  options: {},
  _newLayer: function() {
    return L.tileLayer(get(this, 'tileUrl'), get(this, 'options'));
  }
});

})();



(function() {
var get = Ember.get;

/**
  `EmberLeaflet.CollectionLayer` is the equivalent of `Ember.CollectionView`
  for DOM views -- it observes the `content` array for updates and maintains
  a list of child layers associated with the content array.
 
  @class CollectionLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.CollectionLayer = EmberLeaflet.Layer.extend({
  content: [],

  itemLayerClass: Ember.computed(function() {
    throw new Error("itemLayerClass must be defined.");
  }).property(),

  init: function() {
    this._super();
    this._setupContent();
  },

  willDestroy: function() {
    this._teardownContent();
    this._super();
  },

  contentWillChange: Ember.beforeObserver(function() {
    this._destroyChildLayers();
    this._teardownContent();
  }, 'content'),

  contentDidChange: Ember.observer(function() {
    this._setupContent();
    this._createChildLayers();
  }, 'content'),

  _setupContent: function() {
    if(get(this, 'content')) { get(this, 'content').addArrayObserver(this); }
  },

  _teardownContent: function() {
    if(get(this, 'content')) { 
      get(this, 'content').removeArrayObserver(this); }
  },

  arrayWillChange: function(array, idx, removedCount, addedCount) {
    var removedObjects = array.slice(idx, idx + removedCount);
    var removeLayers = this._childLayers.slice(idx, idx + removedCount);
    removeLayers.invoke('_destroyLayer');
    removeLayers.invoke('destroy');
    this._childLayers.splice(idx, removedCount);
  },

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    var addedObjects = array.slice(idx, idx + addedCount), self = this;
    var addedLayers = addedObjects.map(function(obj) {
      return self._layerForObject(obj);
    });
    var args = [idx, 0].concat(addedLayers);
    this._childLayers.splice.apply(this._childLayers, args);
  },

  _createLayer: function() {
    this._layer = get(this, 'parentLayer')._layer;
    this._createChildLayers();
  },

  _destroyLayer: function() {
    this._destroyChildLayers();
    this._layer = null;
  },

  _createChildLayers: function() {
    if(!get(this, 'parentLayer')._layer) { return; }
    var self = this;
    this._childLayers = get(this, 'content').map(function(obj) {
      return self._layerForObject(obj);
    });
  },

  _layerForObject: function(obj) {
    return this._createChildLayer(get(this, 'itemLayerClass'), {
      content: obj
    });
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set, setProperties = Ember.setProperties;

/**
  `EmberLeaflet.DraggableMixin` adds drag and drop functionality to
  `EmberLeaflet.MarkerLayer` classes.
 
  @class DraggableMixin
  @namespace EmberLeaflet
*/
EmberLeaflet.DraggableMixin = Ember.Mixin.create({
  isDragging: true,
  isDraggable: true,

  dragstart: function() {
    set(this, 'isDragging', true);
  },

  dragend: function() {
    setProperties(this, {
      location: this._layer.getLatLng(),
      isDragging: false
    });
  },

  isDraggableDidChange: Ember.observer(function() {
    if(!this._layer || !this._layer._map) { return; }
    if(get(this, 'isDraggable')) {
      this._layer.dragging.enable();
    } else {
      this._layer.dragging.disable();
    }
  }, 'isDraggable'),

  layerWillChange: Ember.beforeObserver(function() {
    if(!this._layer) { return; }
    this._layer.off('dragstart', this.dragstart, this);
    this._layer.off('dragend', this.dragend, this);
  }, 'layer'),

  layerDidChange: Ember.observer(function() {
    if(!this._layer) { return; }
    this._layer.on('dragstart', this.dragstart, this);
    this._layer.on('dragend', this.dragend, this);
    this.propertyDidChange('isDraggable');
  }, 'layer')

});

})();



(function() {
var get = Ember.get;

/**
  `EmberLeaflet.MarkerLayer` is a leaflet marker.
 
  @class MarkerLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.MarkerLayer = EmberLeaflet.Layer.extend({
  content: null,
  options: null,

  location: Ember.computed.alias('content.location'),

  locationDidChange: Ember.observer(function() {
    if(get(this, 'location') && !this._layer) {
      this._createLayer();
    } else if(this._layer && !get(this, 'location')) {
      this._destroyLayer();
    } else {
      var oldLatLng = this._layer && this._layer.getLatLng();
      var newLatLng = get(this, 'location');
      if(oldLatLng && newLatLng && !oldLatLng.equals(newLatLng)) {
        this._layer.setLatLng(newLatLng);
      }
    }
  }, 'location'),

  _newLayer: function() {
    return L.marker(get(this, 'location'), get(this, 'options'));
  },

  _createLayer: function() {
    if(this._layer || !get(this, 'location')) { return; }
    this._super();
    this._layer.content = get(this, 'content');
  },

  _destroyLayer: function() {
    if(!this._layer) { return; }
    this._super();
  }
});

})();



(function() {
/**
  `EmberLeaflet.MarkerCollectionLayer` is a specific collection layer
  containing marker objects.
 
  @class MarkerCollectionLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.CollectionLayer
*/
EmberLeaflet.MarkerCollectionLayer = EmberLeaflet.CollectionLayer.extend({
  itemLayerClass: EmberLeaflet.MarkerLayer,

  bounds: Ember.computed(function() {
    var latLngs = this.get('content')
      .filterProperty('location')
      .mapProperty('location');
    return Ember.isEmpty(latLngs) ? null : new L.LatLngBounds(latLngs);
  }).property('content.@each.location')
});

})();



(function() {
/**
Ember Leaflet

@module ember-leaflet
*/

})();

