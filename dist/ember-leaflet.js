// Version: v0.5.0-11-gb4cc0e0
// Last commit: b4cc0e0 (2014-06-19 14:05:45 -0700)


(function() {
EmberLeaflet = Ember.Namespace.create();

})();



(function() {
var get = Ember.get, set = Ember.set;

/**
Convert a L.LatLng object to a [lat, lng] array.
*/
function latLngArrayFromLatLng(latLng) {
  return latLng ? [latLng.lat, latLng.lng] : null; }

/**
Convert a L.LatLng object to a [lng, lat] array.
*/
function lngLatArrayFromLatLng(latLng) {
  return latLng ? [latLng.lng, latLng.lat] : null; }

/**
Convert a [lat, lng] array to an L.LatLng object. If LatLng is passed in,
pass it through.
*/
function latLngFromLatLngArray(arr) {
  return arr ? (arr.lat ? arr : L.latLng(arr[0], arr[1])) : null; }

/**
Convert a [lng, lat] array to an L.LatLng object. If LatLng is passed in,
pass it through.
*/
function latLngFromLngLatArray(arr) {
  return arr ? (arr.lat ? arr : L.latLng(arr[1], arr[0])) : null; }


EmberLeaflet.convert = {
  latLngArrayFromLatLng: latLngArrayFromLatLng,
  lngLatArrayFromLatLng: lngLatArrayFromLatLng,
  latLngFromLatLngArray: latLngFromLatLngArray,
  latLngFromLngLatArray: latLngFromLngLatArray
};

EmberLeaflet.computed = {};

/**
  Define a computed property that converts a [longitude, latitude] array
  to a leaflet LatLng object.

  @method latlngFromLngLatArray
*/
EmberLeaflet.computed.latLngFromLngLatArray = function(coordKey) {
  return Ember.computed(coordKey, function(key, value) {
    if(arguments.length === 1) {
      return latLngFromLngLatArray(get(this, coordKey));
    } else {
      set(this, coordKey, lngLatArrayFromLatLng(value));
      return value;
    }
  });  
};

/**
  Define a computed property that converts a [latitude, longitude] array
  to a leaflet LatLng object.

  @method latlngFromLatLngArray
*/
EmberLeaflet.computed.latLngFromLatLngArray = function(coordKey) {
  return Ember.computed(coordKey, function(key, value) {
    if(arguments.length === 1) {
      return latLngFromLatLngArray(get(this, coordKey));
    } else {
      set(this, coordKey, value = latLngArrayFromLatLng(value));
      return value;
    }
  });  
};

/**
  Define a computed property that gets and sets a value from the
  options object.

  @method optionProperty
*/
EmberLeaflet.computed.optionProperty = function(optionKey) {
  return Ember.computed('options', function(key, value) {
    // override given key with explicitly defined one if necessary
    key = optionKey || key;
    if(arguments.length > 1) { // set
      var setterName = 'set' + Ember.String.classify(key);
      Ember.assert(
        this.constructor + " must have a " + setterName + " function.",
        !!this._layer[setterName]);
      this._layer[setterName].call(this._layer, value);
      return value;
    } else { // get
      return this._layer.options[key];
    }
  });
};

})();



(function() {
var fmt = Ember.String.fmt, forEach = Ember.EnumerableUtils.forEach,
  get = Ember.get;

/**
  `EmberLeaflet.LayerMixin` provides basic functionality for the Ember
  wrapper of Leaflet layers, including instantiating child and parent layers.

  @class LayerMixin
  @namespace EmberLeaflet
*/
EmberLeaflet.LayerMixin = Ember.Mixin.create({
  _layer: null,
  _parentLayer: null,
  isVirtual: false,
  _childLayers: [],

  /**
   List of all supported events. EmberLeaflet will automatically create
   and register event handler functions with the same name for events
   listed in this property.

   Define this property in a derived view to add your own custom events.

   @property events
   @protected
   @type Array
  */
  concatenatedProperties: ['events'],

  /**
    Reference to parent layer. Never set directly.

    @property childLayers
    @type Array
    @private
    @default []
  */
  parentLayer: Ember.computed.alias('_parentLayer').readOnly(),

  layer: Ember.computed(function() { return this._layer; }).property(),

  /**
   Create and return the layer instance for the view.

   This needs to be implemented for any new type of view.

   @protected
  */
  _newLayer: Ember.required(Function),

  /**
   This gets called by the view just before the layer is created.

   @protected
  */
  willCreateLayer: Ember.K,

  /**
   This get called by the view after it has created the layer.

   Override this in your derived view to gain access to newly created
   layer (via `get("layer")`) for any custom functionality you may want
   to add.

   @protected
  */
  didCreateLayer: Ember.K,

  willDestroyLayer: Ember.K,
  didDestroyLayer: Ember.K,

  events: [],

  _createLayer: function() {
    Ember.assert("Layer must not already be created.", !this._layer);
    Ember.assert("Layer must have a parent", !!this._parentLayer);
    Ember.assert("Parent layer must be in leaflet.",
      !!this._parentLayer._layer);
    this.willCreateLayer();
    if(!this.isVirtual) {
      this.propertyWillChange('layer');
      this._layer = this._newLayer();
      this._addEventListeners();
      this._addToParent();
      this.propertyDidChange('layer');
    }
    this.didCreateLayer();
  },

  _destroyLayer: function() {
    this.willDestroyLayer();
    if(!this.isVirtual) {
      Ember.assert("Layer must exist.", !!this._layer);
      this.propertyWillChange('layer');
      this._removeEventListeners();
      this._removeFromParent();
      this._layer = null;
      this.propertyDidChange('layer');
    }
    this.didDestroyLayer();
  },

  _addToParent: function() {
    this._parentLayer._addChild(this._layer);
  },

  _removeFromParent: function() {
    this._parentLayer._removeChild(this._layer);
  },

  _addChild: function(layer) {
    this._layer.addLayer(layer);
  },

  _removeChild: function(layer) {
    this._layer.removeLayer(layer);
  },

  _addEventListeners: function() {
    this._eventHandlers = {};
    forEach(get(this, 'events'), function(eventName) {
      if(typeof this[eventName] === 'function') {
        // create an event handler that runs the function inside an event loop.
        this._eventHandlers[eventName] = function(e) {
          Ember.run(this, this[eventName], e);
        };
        this._layer.addEventListener(eventName,
          this._eventHandlers[eventName], this);
      }
    }, this);
  },

  _removeEventListeners: function() {
    forEach(get(this, 'events'), function(eventName) {
      if(typeof this[eventName] === 'function') {
        this._layer.removeEventListener(eventName,
          this._eventHandlers[eventName], this);
        delete this._eventHandlers[eventName];
      }
    }, this);
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
var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt,
  forEach = Ember.EnumerableUtils.forEach,
  map = Ember.EnumerableUtils.map;

/**
  A `ContainerLayerMixin` is an `EmberLeaflet.Layer` mixin that implements `Ember.MutableArray`
  allowing programatic management of its child layers.

  @class ContainerLayerMixin
  @namespace EmberLeaflet
  @extends EmberLeaflet.LayerMixin
  @extends Ember.MutableArray
*/
EmberLeaflet.ContainerLayerMixin = Ember.Mixin.create(
    EmberLeaflet.LayerMixin, Ember.MutableArray, {
  /**
  Initialize child layers from the class variable. This should only be
  called once.
  */

  _childLayers: null,

  didCreateLayer: function() {
    this._super();
    this.createAndAddChildLayers();
  },

  willDestroyLayer: function() {
    this.removeAndDestroyChildLayers();
    this._super();
  },

  createAndAddChildLayers: function() {
    var _childLayers = this._childLayers = Ember.A(), self = this, layer;
    if(this._childLayerClasses === undefined) {
      this._childLayerClasses = get(this, 'childLayers') || [];
    }
    Ember.defineProperty(this, 'childLayers', Ember.computed(function() {
      return this._childLayers;
    }));

    forEach(this._childLayerClasses, function(layerClass, idx) {
      layer = self.createChildLayer(layerClass);
      self.addChildLayer(layer);
      _childLayers[idx] = layer;
    }, this);
  },

  replace: function(idx, removedCount, addedLayers) {
    var addedCount = addedLayers ? get(addedLayers, 'length') : 0,
      self = this;
    this.arrayContentWillChange(idx, removedCount, addedCount);
    this.childLayersWillChange(this._childLayers, idx, removedCount);

    if (addedCount === 0) {
      this._childLayers.splice(idx, removedCount);
    } else {
      // instantiate class objects, make sure controller and 
      // _parentLayer is set for each layer object added.
      addedLayers = map(addedLayers, function(layer) {
        return self.createChildLayer(layer);
      });
      var args = [idx, removedCount].concat(addedLayers);
      if (addedLayers.length && !this._childLayers.length) {
        this._childLayers = this._childLayers.slice();
      }
      this._childLayers.splice.apply(this._childLayers, args);
    }
    this.arrayContentDidChange(idx, removedCount, addedCount);
    this.childLayersDidChange(this._childLayers, idx, removedCount,
      addedCount);
    return this;
  },

  objectAt: function(idx) {
    return this._childLayers[idx];
  },

  length: Ember.computed(function () {
    return this._childLayers.length;
  }),

  childLayersWillChange: function(layers, start, removed) {
    var self = this;
    this.propertyWillChange('childLayers');
    if(removed > 0) {
      var removedLayers = layers.slice(start, start + removed);
      forEach(removedLayers, function(layer) {
        self.removeChildLayer(layer);
      });
    }
  },

  childLayersDidChange: function(layers, start, removed, added) {
    var self = this;
    if(added > 0) {
      var addedLayers = layers.slice(start, start + added);
      forEach(addedLayers, function(layer) {
        self.addChildLayer(layer);
      });
    }
    this.propertyDidChange('childLayers');
  },

  addChildLayer: function(layer) {
    layer._createLayer();
  },

  removeChildLayer: function(layer) {
    layer._destroyLayer();
  },

  createChildLayer: function(layerClass, attrs) {
    attrs = attrs || {};
    attrs.container = this.get('container');
    attrs.controller = this.get('controller');
    attrs._parentLayer = this.isVirtual ? this._parentLayer : this;
    var layerInstance;
    var layerType = Ember.typeOf(layerClass);
    Ember.assert(
      fmt("layerClass %@ must be an Ember instance or class.",
        layerClass ? layerClass.toString() : '<undefined>'),
        layerType === 'instance' || layerType === 'class');
    if(layerType === 'instance') {
      layerInstance = layerClass;
      layerInstance.setProperties(attrs);
    } else if (layerType === 'class'){
      layerInstance = layerClass.create(attrs);
    }
    return layerInstance;
  },

  removeAndDestroyChildLayers: function() {
    var self = this;
    if(this._childLayers) {
      forEach(this._childLayers, function(layer) {
        self.removeChildLayer(layer);
        layer.destroy();
      });
    }
    this._childLayers = [];
  }
});

/**
  A `ContainerLayer` is an empty collection layer that you can programmatically
  add new layers to.

  @class ContainerLayer
  @namespace EmberLeaflet
  @uses EmberLeaflet.ContainerLayerMixin
*/
EmberLeaflet.ContainerLayer = Ember.Object.extend(
    EmberLeaflet.ContainerLayerMixin, {
  /**
  Default _newLayer calls L.layerGroup to allow adding of new layers.
  */
  _newLayer: function() { return L.layerGroup(); }
});

})();



(function() {
/**
  `EmberLeaflet.MapView` is an `Ember.View` object present in the DOM, and
  also instantiates a Leaflet map inside.
 
  @class MapView
  @namespace EmberLeaflet
  @extends EmberLeaflet.ContainerLayerMixin
*/

var DEFAULT_CENTER = L.latLng(40.713282, -74.006978);

EmberLeaflet.MapView = Ember.View.extend(EmberLeaflet.ContainerLayerMixin, {
  options: {},
  center: DEFAULT_CENTER,
  zoom: 16,
  
  isMoving: false,
  isZooming: false,

  // Events this map can respond to.
  events: [
    'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
    'mousemove', 'contextmenu', 'focus', 'blur', 'preclick', 'load',
    'unload', 'viewreset', 'movestart', 'move', 'moveend', 'dragstart',
    'drag', 'dragend', 'zoomstart', 'zoomend', 'zoomlevelschange',
    'resize', 'autopanstart', 'layeradd', 'layerremove',
    'baselayerchange', 'overlayadd', 'overlayremove', 'locationfound',
    'locationerror', 'popupopen', 'popupclose'],

  init: function() {
    this._super();
    if(this.get('childLayers') === undefined) {
      this.set('childLayers', [EmberLeaflet.DefaultTileLayer]);
    }
  },

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

  zoomstart: function(e) {
    this.set('isZooming', true);
  },

  zoomend: function(e) {
    this.setProperties({isZooming: false, zoom: this._layer.getZoom()});
    // if two zooms are called at once, a zoom could get queued. So
    // set zoom to the queued one if relevant.
    if(this._queuedZoom) {
      if(this._queuedZoom !== this._layer.getZoom()) {
        this._layer.setZoom(this._queuedZoom); }
      this._queuedZoom = null;
    }
  },

  movestart: function(e) {
    this.set('isMoving', true);
  },

  moveend: function(e) {
    this.set('isMoving', false);
  },

  move: function(e) {
    this.set('center', this._layer.getCenter());    
  },

  zoomDidChange: Ember.observer(function() {
    if(!this._layer || Ember.isNone(this.get('zoom'))) { return; }
    if(this._layer._animatingZoom) {
      this._queuedZoom = this.get('zoom');
    } else {
      this._layer.setZoom(this.get('zoom'));
    }
  }, 'zoom'),
  
  centerDidChange: Ember.observer(function() {
    if (!this._layer || this.get('isMoving') ||
      !this.get('center')) { return; }
    if (!this._layer.getCenter().equals(this.get('center'))) {
      this._layer.panTo(this.get('center'));
    }
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
  },

  tileUrlDidChange: Ember.observer(function() {
    if(!this._layer) { return; }
    this._layer.setUrl(this.get('tileUrl'));
  }, 'tileUrl'),

  zIndex: EmberLeaflet.computed.optionProperty(),
  opacity: EmberLeaflet.computed.optionProperty()
});

EmberLeaflet.DefaultTileLayer = EmberLeaflet.TileLayer.extend({
  tileUrl: 'http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png'
});

})();



(function() {
var get = Ember.get, set = Ember.set, setProperties = Ember.setProperties;

/**
  `EmberLeaflet.PopupMixin` adds popup functionality to any
  `EmberLeaflet.Layer` class.
 
  @class PopupMixin
  @namespace EmberLeaflet
*/
EmberLeaflet.PopupMixin = Ember.Mixin.create({
  popupContent: '',
  popupViewClass: null,
  popupOptions: {offset: L.point(0, -36)},
  
  click: function(e) {
    if(this._super) { this._super(e); }
    this.openPopup(e);
  },

  dragstart: function(e) {
    if(this._super) { this._super(e); }
    this.closePopup();
  },

  openPopup: function(e) {
    this.willOpenPopup();
    var latLng;
    if (this._layer.getLatLng) { latLng = this._layer.getLatLng(); }
    else { latLng = L.latLngBounds(this._layer.getLatLngs()).getCenter(); }
    this._popup
      .setLatLng((e && e.latlng) || latLng)
      .openOn(this._layer._map);
    this._createPopupContent();
    this.didOpenPopup();    
  },

  closePopup: function() {
    this.willClosePopup();
    this._layer._map.closePopup();
    this.didClosePopup();    
  },

  willOpenPopup: Ember.K,
  didOpenPopup: Ember.K,

  willClosePopup: Ember.K,
  didClosePopup: Ember.K,

  willCreatePopup: Ember.K,
  didCreatePopup: Ember.K,

  willDestroyPopup: Ember.K,
  didDestroyPopup: Ember.K,

  _createPopupContent: function() {
    if(!this.get('popupViewClass')) {
      this._popup.setContent(this.get('popupContent'));
      return;
    }
    if(this._popupView) { this._destroyPopupContent(); }
    this._popupView = this.get('popupViewClass').create({
      container: this.get('container'),
      controller: this.get('controller'),
      context: this.get('controller')
    });
    var self = this;
    this._popupView._insertElementLater(function() {
      self._popupView.$().appendTo(self._popup._contentNode);
    });
  },

  _destroyPopupContent: function() {
    if(!this.get('popupViewClass')) { return; }
    if(this._popupView) {
      this._popupView.destroy();
      this._popupView = null;
    }
  },

  _createPopup: function() {
    this.willCreatePopup();
    this._popup = L.popup(this.get('popupOptions'), this._layer);
    var oldOnRemove = this._popup.onRemove, self = this;
    this._popup.onRemove = function(map) {
      self._destroyPopupContent();
      oldOnRemove.call(self._popup, map);
    };
    this.didCreatePopup();
  },

  _destroyPopup: function() {
    if(!this._popup) { return; }
    this.willDestroyPopup();
    // closing popup will call _destroyPopupContent
    if(this._popup._map && this._layer && this._layer._map) {
      this._layer._map.closePopup(); }
    this._popup = null;
    this.didDestroyPopup();
  },

  _updatePopup: Ember.observer(function() {
    if(!this._popup) { return; }
    this._popup.setContent(get(this, 'popupContent'));
  }, 'popupContent'),

  _removePopupObservers: Ember.beforeObserver(function() {
    if(!this._layer) { return; }
    this._destroyPopup();
  }, 'layer'),

  _addPopupObservers: Ember.observer(function() {
    if(!this._layer) { return; }
    this._createPopup();
  }, 'layer')
});

})();



(function() {
var get = Ember.get;

/**
  `EmberLeaflet.BoundsMixin` provides the ability to get a collection's
  bounds by its locations property.
 
  @class BoundsMixin
  @namespace EmberLeaflet
  @extends Ember.Mixin
*/
EmberLeaflet.BoundsMixin = Ember.Mixin.create({

  /** Calculate bounds, or if object is already a bounds, return it. */
  bounds: Ember.computed(function() {
    var locations = get(this, 'locations');
    if (locations instanceof L.LatLngBounds) { return locations; }
    if(!locations || !get(locations, 'length')) { return null; }
    return L.latLngBounds(locations);
  }).property('locations').volatile()
});

})();



(function() {
var get = Ember.get, forEach = Ember.EnumerableUtils.forEach;

/**
  `EmberLeaflet.CollectionLayer` is the equivalent of `Ember.CollectionView`
  for DOM views -- it observes the `content` array for updates and maintains
  a list of child layers associated with the content array.
 
  @class CollectionLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.CollectionLayer = EmberLeaflet.ContainerLayer.extend({
  content: [],
  isVirtual: true, 

  itemLayerClass: Ember.computed(function() {
    throw new Error("itemLayerClass must be defined.");
  }).property(),

  didCreateLayer: function() {
    this._super();
    this._contentDidChange();
  },

  willDestroyLayer: function() {
    this._contentWillChange();
    this._super();
  },

  _contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content');
    if(content) { content.removeArrayObserver(this); }
    var len = content ? get(content, 'length') : 0;
    this.arrayWillChange(content, 0, len);
  }, 'content'),

  _contentDidChange: Ember.observer(function() {
    var content = get(this, 'content');
    if(content) { content.addArrayObserver(this); }
    var len = content ? get(content, 'length') : 0;
    this.arrayDidChange(content, 0, null, len);    
  }, 'content'),

  arrayWillChange: function(array, idx, removedCount, addedCount) {
    for(var i = idx; i < idx + removedCount; i++) {
      this.objectWasRemoved(array.objectAt(i));
    }
  },

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    for(var i = idx; i < idx + addedCount; i++) {
      this.objectWasAdded(array.objectAt(i), i);
    }
  },

  objectWasAdded: function(obj, index) {
    if(index === undefined) { index = this._childLayers.length; }
    var childLayer = this.createChildLayer(get(this, 'itemLayerClass'), {
      content: obj
    });
    this.replace(index, 0, [childLayer]);
  },

  objectWasRemoved: function(obj) {
    var layer;
    for(var i = 0, l = this._childLayers.length; i < l; i++) {
      layer = this._childLayers[i];
      if(layer.get('content') === obj) {
        this.replace(i, 1, []);
        layer.destroy();
        return;
      }
    }
  }  
});

})();



(function() {
/**
  `EmberLeaflet.CollectionBoundsMixin` provides bounding box functionality
  to a collection layer.
 
  @class CollectionBoundsMixin
  @namespace EmberLeaflet
  @extends Ember.Mixin
  @uses EmberLeaflet.BoundsMixin
*/
EmberLeaflet.CollectionBoundsMixin = Ember.Mixin.create(
    EmberLeaflet.BoundsMixin, {
  
  locations: Ember.computed('@each.location', function() {
    return this.filterProperty('location').mapProperty('location');
  })

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
  isDragging: false,
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

  _updateDraggability: Ember.observer(function() {
    if(!this._layer || !this._layer._map) { return; }
    if(get(this, 'isDraggable')) {
      this._layer.dragging.enable();
    } else {
      this._layer.dragging.disable();
    }
  }, 'isDraggable', 'layer')
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

  /**
  Should override this binding with a reference to the location property
  of the content object.
  */
  location: Ember.computed.alias('content.location'),

  /** Forwards to respective options property */
  zIndexOffset: EmberLeaflet.computed.optionProperty(),
  opacity: EmberLeaflet.computed.optionProperty(),

  /** events receivable */
  events: ['click', 'dblclick', 'mousedown', 'mouseover', 'mouseout',
    'contextmenu', 'dragstart', 'drag', 'dragend', 'move', 'remove',
    'popupopen', 'popupclose'],

  /**
  Detect clustering above this marker. And return if this marker is inside
  a cluster object.
  */
  _detectClustering: function() {
    var cursor = this;
    while(cursor._parentLayer) {
      cursor = cursor._parentLayer;
      if(cursor._isCluster) { return true; }
    }
    return false;
  },

  _updateLayerOnLocationChange: Ember.observer(function() {
    var newLatLng = get(this, 'location');
    if(newLatLng && !this._layer) {
      this._createLayer();
    } else if(this._layer && !newLatLng) {
      this._destroyLayer();
    } else {
      var oldLatLng = this._layer && this._layer.getLatLng();
      if(oldLatLng && newLatLng && !oldLatLng.equals(newLatLng)) {
        if(this._detectClustering()) {
          this._destroyLayer();
          this._createLayer();
        } else {
          this._layer.setLatLng(newLatLng);
        }
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

    // Add a notification for layer changing on the onAdd function.
    var oldAdd = this._layer.onAdd, self = this;
    this._layer.onAdd = function() {
      self.propertyWillChange('layer');
      oldAdd.apply(this, arguments);
      self.propertyDidChange('layer');
    };
    this.notifyPropertyChange('layer');
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
  @uses EmberLeaflet.BoundsMixin
*/
EmberLeaflet.MarkerCollectionLayer = EmberLeaflet.CollectionLayer.extend({
  itemLayerClass: EmberLeaflet.MarkerLayer
});

})();



(function() {
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

})();



(function() {
/**
  `EmberLeaflet.PathLayer` is a generic layer to be inherited
  by other geometry layer classes. Both CircleGeometry and PathGeometry
  layers derive from it.
 
  @class PathLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
var set = Ember.set, get = Ember.get;


function pathStyleProperty(styleKey) {
  return Ember.computed('options', function(key, value) {
    // override given key with explicitly defined one if necessary
    key = styleKey || key;
    if(arguments.length > 1) { // set
      // Update style on existing object
      if(this._layer) {
        var styleObject = {};
        styleObject[key] = value;
        this._layer.setStyle(styleObject);
      }
      // Update options object for later initialization.
      if(!get(this, 'options')) { set(this, 'options', {}); }
      this.get('options')[key] = value;
      return value;
    } else { // get
      return this._layer.options[key];
    }
  });
}

EmberLeaflet.PathLayer = EmberLeaflet.Layer.extend({

	// Style options available to all L.Path layers
	stroke: pathStyleProperty(),
	color: pathStyleProperty(),
	weight: pathStyleProperty(),
	opacity: pathStyleProperty(),
	fill: pathStyleProperty(),
	fillColor: pathStyleProperty(),
	fillOpacity: pathStyleProperty(),
	dashArray: pathStyleProperty()
});

})();



(function() {
var get = Ember.get,
  latLngFromArray = EmberLeaflet.convert.latLngFromLatLngArray;

/**
  `EmberLeaflet.PointPathLayer` is a base geometry on the map that
  adjusts based on a content object that should be a LatLng object.
 
  @class PointPathLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.PointPathLayer = EmberLeaflet.PathLayer.extend({

  location: Ember.computed.alias('content.location'),
  
  _createLayer: function() {
    // don't create layer if we don't have a location.
    if(this._layer || !get(this, 'location')) { return; }
    this._super();    
  },

  _updateLayerOnLocationChange: Ember.observer(function() {
    var newLatLng = latLngFromArray(get(this, 'location'));
    if(newLatLng && !this._layer) {
      this._createLayer();
    } else if(this._layer && !newLatLng) {
      this._destroyLayer();
    } else if(this._layer) {
      var oldLatLng = this._layer.getLatLng();
      if(oldLatLng && newLatLng && !oldLatLng.equals(newLatLng)) {
        this._layer.setLatLng(newLatLng);
      }
    }
  }, 'location')
});

})();



(function() {
var get = Ember.get,
  latLngFromArray = EmberLeaflet.convert.latLngFromLatLngArray;


/**
  `EmberLeaflet.CircleLayer` is a circle on the map that adjusts based
  on a content object that should be an array of LatLng objects.
 
  @class CircleLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.PointPathLayer
*/
EmberLeaflet.CircleLayer = EmberLeaflet.PointPathLayer.extend({
  
  /**
  If this property is null, watch the content object for radius updates.
  If this property is set, look inside this property of the content object
  for the radius.
  */
  radius: Ember.computed.alias('content.radius'),
  
  _updateLayerOnRadiusChange: Ember.observer(function() {
    var newRadius = get(this, 'radius');
      
    if(newRadius && !this._layer) {
      this._createLayer();
    } else if(this._layer && !newRadius) {
      this._destroyLayer();
    } else {
      var oldRadius = this._layer && this._layer.getRadius();
      if(oldRadius && newRadius && (oldRadius !== newRadius)) {
        this._layer.setRadius(newRadius);
      }
    }
  }, 'radius'),
  
  _newLayer: function() {
    // Convert from array if an array somehow got through.
    return L.circle(latLngFromArray(get(this, 'location')),
      get(this, 'radius'), get(this, 'options'));
  }, 
  
  _destroyLayer: function() {
    if(!this._layer) { return; }
    this._super();
  }
});

})();



(function() {
var get = Ember.get,
  latLngFromArray = EmberLeaflet.convert.latLngFromLatLngArray;

/**
  `EmberLeaflet.ArrayPathLayer` is a base geometry on the map that
  adjusts based on a content object that should be an array of
  LatLng objects.
 
  @class ArrayPathLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.ArrayPathLayer = EmberLeaflet.PathLayer.extend({
  init: function() {
    this._super();
    this._setupLocationObservers();
  },

  destroy: function() {
    this._teardownLocationObservers();
    return this._super();
  },

  /**
  If this property is null, watch the content object for location updates.
  If this property is set, look inside this property of the content object
  for the locations array.
  */
  locationsProperty: null,

  /**
  If this property is null, each item in the locations array (whether it 
  is the content object or a subitem of it) is a LatLng object. If this is
  set, then look inside this property of each item in the array for its
  location.
  */
  locationProperty: null,

  /**
  The computed array of locations.
  */
  locations: Ember.computed(function() {
    var locationProperty = get(this, 'locationProperty'),
        locationsProperty = get(this, 'locationsProperty'),
        locationsPath = 'content' + (locationsProperty ? '.' +
          locationsProperty : ''),
        locations = get(this, locationsPath) || Ember.A();
    if(locationProperty) {
      locations = locations.mapProperty(locationProperty); }
    locations = locations.filter(function(i) { return !!i; });
    // Convert any arrays that somehow made it through to latLngs.
    locations = locations.map(latLngFromArray);
    return locations;
  }).property('content', 'locationProperty', 'locationsProperty').volatile(),

  _contentWillChange: Ember.beforeObserver(function() {
    this._contentLocationsWillChange();
    this._teardownLocationObservers();
  }, 'content', 'locationsProperty', 'locationProperty'),

  _contentDidChange: Ember.observer(function() {
    this._setupLocationObservers();
    this._contentLocationsDidChange();
  }, 'content', 'locationsProperty', 'locationProperty'),

  _setupLocationObservers: function() {
    var content = get(this, 'content'),
      locationProperty = get(this, 'locationProperty'),
      locationsProperty = get(this, 'locationsProperty');
    if(!content) { return; }

    // Add observer on locations property of content if relevant.
    var contentLocationsProperty = locationsProperty ? 
      'content.' + locationsProperty : 'content';
    if (locationsProperty) {
      Ember.addBeforeObserver(this, contentLocationsProperty, this,
        '_contentLocationsWillChange');
      Ember.addObserver(this, contentLocationsProperty, this,
        '_contentLocationsDidChange');
    }

    // Add array observer for new/removed items in content list
    var arr = locationsProperty ? get(content, locationsProperty) : content;
    Ember.assert("Content object or locations property must be array-like",
      !arr || !!arr.addArrayObserver);
    if(arr) { arr.addArrayObserver(this); }

    // Add @each chain observer for location property on array.
    if(locationProperty) {
      var contentLocationsChainProperty = contentLocationsProperty +
        '.@each.' + locationProperty;
      Ember.addBeforeObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsWillChange');
      Ember.addObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsDidChange');
    }
  },

  _teardownLocationObservers: function() {
    var content = get(this, 'content'),
      locationProperty = get(this, 'locationProperty'),
      locationsProperty = get(this, 'locationsProperty');
    if(!content) { return; }    

    // Remove observer on locations property of content.
    var contentLocationsProperty = locationsProperty ? 
      'content.' + locationsProperty : 'content';
    if (locationsProperty) {
      Ember.addBeforeObserver(this, contentLocationsProperty, this,
        '_contentLocationsWillChange');
      Ember.addObserver(this, contentLocationsProperty, this,
        '_contentLocationsDidChange');
    }

    // Remove array observer for new/removed items in content list
    var arr = locationsProperty ? get(content, locationsProperty) : content;
    if(arr) { arr.removeArrayObserver(this); }

    // Remove @each chain observer for location property on array.
    if(locationProperty) {
      var contentLocationsChainProperty = contentLocationsProperty +
        '.@each.' + locationProperty;
      Ember.removeBeforeObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsWillChange');
      Ember.removeObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsDidChange');
    }    
  },

  _contentLocationsWillChange: function() {
    this.propertyWillChange('locations');
  },

  _contentLocationsDidChange: function() {
    this.propertyDidChange('locations');
  },

  /** On any change to the array, just update the entire leaflet path,
  as it reprocesses the whole thing anyway. */
  arrayWillChange: function(array, idx, removedCount, addedCount) {
    this.propertyWillChange('locations');
  },

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    this.propertyDidChange('locations');
  }
});

})();



(function() {
var get = Ember.get;

/**
  `EmberLeaflet.PolylineLayer` is a polyline on the map that adjusts based
  on a content object that should be an array of LatLng objects.
 
  @class PolylineLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.ArrayPathLayer
*/
EmberLeaflet.PolylineLayer = EmberLeaflet.ArrayPathLayer.extend({
  options: {},

  events: ['click', 'dblclick', 'mousedown', 'mouseover', 'mouseout',
    'contextmenu', 'add', 'remove', 'popupopen', 'popupclose'],

  _newLayer: function() {
    return L.polyline(get(this, 'locations'), get(this, 'options'));
  },

  locationsDidChange: Ember.observer(function() {
    if(!this._layer) { return; }
    this._layer.setLatLngs(get(this, 'locations'));    
  }, 'locations')
});

EmberLeaflet.PolygonLayer = EmberLeaflet.PolylineLayer.extend({
  _newLayer: function() {
    return L.polygon(get(this, 'locations'), get(this, 'options'));
  }
});

})();



(function() {
var get = Ember.get;

/**
  `EmberLeaflet.PathBoundsLayer` is a base class that takes a list
  of locations and computed the bounding box.
 
  @class PathBoundsLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.ArrayPathLayer
*/
EmberLeaflet.PathBoundsLayer = EmberLeaflet.ArrayPathLayer.extend(
  EmberLeaflet.BoundsMixin, {});

})();



(function() {
var get = Ember.get;

/**
  `EmberLeaflet.RectangleLayer` is a rectangle on the map that adjusts based
  on a content object that should be an array of LatLng objects.
 
  @class RectangleLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.PathBoundsLayer
*/
EmberLeaflet.RectangleLayer = EmberLeaflet.PathBoundsLayer.extend({

  events: ['click', 'dblclick', 'mousedown', 'mouseover', 'mouseout',
    'contextmenu', 'add', 'remove', 'popupopen', 'popupclose'],

  _newLayer: function() {
    return L.rectangle(get(this, 'bounds'), get(this, 'options'));
  },

  _createLayer: function() {
    if(!get(this, 'bounds')) { return; }
    this._super();
  },

  boundsDidChange: Ember.observer(function() {
    var bounds = get(this, 'bounds');
    if(this._layer && !bounds) {
      this._destroyLayer();
    } else if(bounds && !this._layer) {
      this._createLayer();
    } else if(bounds && this._layer) {
      this._layer.setBounds(bounds);
    }
  }, 'locations')
});

})();



(function() {
/**
Ember Leaflet

@module ember-leaflet
*/

})();

