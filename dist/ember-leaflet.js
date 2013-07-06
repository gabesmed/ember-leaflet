// Last commit: bf94a1e (2013-07-06 12:44:53 -0400)


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
  isVirtual: false, 
  _childLayers: [],

  /**
    @private

    Reference to parent layer. Never set directly.

    @property childLayers
    @type Array
    @default []
  */
  parentLayer: Ember.computed.alias('_parentLayer').readOnly(),
  
  layer: Ember.computed(function() { return this._layer; }).property(),

  _newLayer: Ember.required(Function),

  willCreateLayer: Ember.K,
  didCreateLayer: Ember.K,

  willDestroyLayer: Ember.K,
  didDestroyLayer: Ember.K,

  _createLayer: function() {
    Ember.assert("Layer must not already be created.", !this._layer);
    Ember.assert("Layer must have a parent", !!this._parentLayer);
    Ember.assert("Parent layer must be in leaflet.",
      !!this._parentLayer._layer);
    this.willCreateLayer();
    if(!this.isVirtual) {
      this.propertyWillChange('layer');
      this._layer = this._newLayer();
      this._parentLayer._layer.addLayer(this._layer);
      this.propertyDidChange('layer');
    }
    this.didCreateLayer();
  },

  _destroyLayer: function() {
    this.willDestroyLayer();
    if(!this.isVirtual) {
      Ember.assert("Layer must exist.", !!this._layer);
      this.propertyWillChange('layer');
      try {
        this._parentLayer._layer.removeLayer(this._layer);
      } catch(err) {
        Ember.Logger.warn("Error removing layer on " + this.constructor);
      }
      this._layer = null;
      this.propertyDidChange('layer');
    }
    this.didDestroyLayer();
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
  A `ContainerLayer` is an `EmberLeaflet.Layer` subclass that implements `Ember.MutableArray`
  allowing programatic management of its child layers.

  @class ContainerLayer
  @namespace Ember
  @extends EmberLeaflet.Layer
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
    if(this._childLayerClasses === undefined) {
      this._childLayerClasses = get(this, 'childLayers') || [];
    }
    // redefine view's childLayers property that was obliterated
    Ember.defineProperty(this, 'childLayers', Ember.computed(function() {
      return this._childLayers;
    }).property());

    var _childLayers = this._childLayers = Ember.A(), self = this, layer;

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
    forEach(this._childLayers, function(layer) {
      self.removeChildLayer(layer);
      layer.destroy();
    });
    this._childLayers = [];
  }

});

EmberLeaflet.ContainerLayer = Ember.Object.extend(
    EmberLeaflet.ContainerLayerMixin, {});

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

EmberLeaflet.DefaultTileLayer = EmberLeaflet.TileLayer.extend({
  tileUrl: 'http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png'
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
    this._childLayers = Ember.A();
    this._contentDidChange();
    var content = get(this, 'content');
    if(content) { content.addArrayObserver(this); }
  },

  willDestroyLayer: function() {
    var content = get(this, 'content');
    if(content) { content.removeArrayObserver(this); }
    this._contentWillChange();
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
var get = Ember.get;

/**
  `EmberLeaflet.HashLayer` is like 'EmberLeaflet.CollectionLayer'
  except it combines items that share the same location, and the `content`
  object for each item is an array of objects, not the single object.
 
  @class HashLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.HashLayer = EmberLeaflet.CollectionLayer.extend({

  hashByProperty: 'location',
  hashIsLocation: true,

  _compareLocations: function(loc1, loc2) {
    if(!loc1 || !loc2) { return false; }
    if(loc1.lat.toFixed(6) !== loc2.lat.toFixed(6)) { return false; }
    if(loc1.lng.toFixed(6) !== loc2.lng.toFixed(6)) { return false; }
    return true;
  },

  _getChildLayerIndexByObject: function(obj) {
    var hashByProperty = get(this, 'hashByProperty'),
        hashIsLocation = get(this, 'hashIsLocation');
    for(var i = 0, l = this._childLayers.length; i < l; i++) {
      var layerKey = get(this._childLayers[i], hashByProperty);
      var objKey = get(obj, hashByProperty);
      if(hashIsLocation) {
        if(this._compareLocations(layerKey, objKey)) { return i; }        
      } else {
        if(layerKey === objKey) { return i; }
      }
    }
    return -1;
  },

  _getChildLayerByObject: function(obj) {
    var index = this._getChildLayerIndexByObject(obj);
    return index === -1 ? null : this._childLayers[index];
  },

  objectWasAdded: function(obj) {
    var childLayer = this._getChildLayerByObject(obj),
        itemLayerClass = get(this, 'itemLayerClass'),
        hashByProperty = get(this, 'hashByProperty'),
        objKey = get(obj, hashByProperty), props;
    if(childLayer) {
      get(childLayer, 'content').addObject(obj);
    } else {
      props = {content: Ember.A([obj])};
      props[hashByProperty] = objKey;
      childLayer = this._createChildLayer(itemLayerClass, props);
      this._childLayers.push(childLayer);
    }
  },

  objectWasRemvoed: function(obj) {
    var layer;
    for(var i = 0, l = this._childLayers.length; i < l; i++) {
      layer = this._childLayers[i];
      if(get(layer, 'content').indexOf(obj) !== -1) {
        get(layer, 'content').removeObject(obj);
      }
      if(get(layer, 'content.length') === 0) {
        layer._destroyLayer();
        layer.destroy();
        this._childLayers.splice(i, 1);
        return;
      }
    }
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
  isDragging: false,
  isDraggable: true,

  _onDragStart: function() {
    set(this, 'isDragging', true);
  },

  _onDragEnd: function() {
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
  }, 'isDraggable', 'layer'),

  _removeDraggableObservers: Ember.beforeObserver(function() {
    if(!this._layer) { return; }
    this._layer.off('dragstart', this._onDragStart, this);
    this._layer.off('dragend', this._onDragEnd, this);
  }, 'layer'),

  _addDraggableObservers: Ember.observer(function() {
    if(!this._layer) { return; }
    this._layer.on('dragstart', this._onDragStart, this);
    this._layer.on('dragend', this._onDragEnd, this);
  }, 'layer')

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
  popupContent: 'default popup content',
  popupOptions: {offset: L.point(0, -36)},
  
  _onClickOpenPopup: function(e) {
    this.openPopup();
  },

  _onDragStartClosePopup: function(e) {
    this.closePopup();
  },

  openPopup: function() {
    this.willOpenPopup();
    this._popup
      .setLatLng(this._layer.getLatLng())
      .setContent(this.get('popupContent'))
      .openOn(this._layer._map);
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

  _createPopup: function() {
    this.willCreatePopup();
    this._popup = L.popup(this.get('popupOptions'));
    this.didCreatePopup();
  },

  _destroyPopup: function() {
    if(!this._popup) { return; }
    this.willDestroyPopup();
    if(this._popup._map && this._layer && this._layer._map) {
      this._layer._map.closePopup(); }
    this._popup = null;
    this.didDestroyPopup();
  },

  _removePopupObservers: Ember.beforeObserver(function() {
    if(!this._layer) { return; }
    this._layer.off('click', this._onClickOpenPopup, this);
    this._layer.off('dragstart', this._onDragStartClosePopup, this);
    this._destroyPopup();
  }, 'layer'),

  _addPopupObservers: Ember.observer(function() {
    if(!this._layer) { return; }
    this._createPopup();
    this._layer.on('click', this._onClickOpenPopup, this);
    this._layer.on('dragstart', this._onDragStartClosePopup, this);
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

  /**
  Should override this binding with a reference to the location property
  of the content object.
  */
  location: Ember.computed.alias('content.location'),

  _updateLayerOnLocationChange: Ember.observer(function() {
    var newLatLng = get(this, 'location');
    if(newLatLng && !this._layer) {
      this._createLayer();
    } else if(this._layer && !newLatLng) {
      this._destroyLayer();
    } else {
      var oldLatLng = this._layer && this._layer.getLatLng();
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
var get = Ember.get, forEach = Ember.EnumerableUtils.forEach;

/**
  `EmberLeaflet.BoundsMixin` provides the ability to get a collection's
  bounds by its contents.
 
  @class BoundsMixin
  @namespace EmberLeaflet
  @extends Ember.Mixin
*/
EmberLeaflet.BoundsMixin = Ember.Mixin.create({
  bounds: Ember.computed(function() {
    var latLngs = [], latLng;
    forEach(this, function(childLayer) {
      if(latLng = get(childLayer, 'location')) { latLngs.push(latLng); }
    });
    return Ember.isEmpty(latLngs) ? null : new L.LatLngBounds(latLngs);
  }).property('@each.location')
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
EmberLeaflet.MarkerCollectionLayer = EmberLeaflet.CollectionLayer.extend(
    EmberLeaflet.BoundsMixin, {
  itemLayerClass: EmberLeaflet.MarkerLayer
});

})();



(function() {
var get = Ember.get, forEach = Ember.EnumerableUtils.forEach;

/**
  `EmberLeaflet.MarkerHashLayer` is a specific collection layer
  containing marker objects.
 
  @class MarkerHashLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.HashLayer
  @uses EmberLeaflet.BoundsMixin
*/
EmberLeaflet.MarkerHashLayer = EmberLeaflet.HashLayer.extend(
    EmberLeaflet.BoundsMixin, {
  itemLayerClass: EmberLeaflet.MarkerLayer,
  hashByProperty: 'location',
  hashIsLocation: true
});

})();



(function() {
var get = Ember.get;

/**
  `EmberLeaflet.ArrayGeometryLayer` is a base geometry on the map that
  adjusts based on a content object that should be an array of
  LatLng objects.
 
  @class ArrayGeometryLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.ArrayGeometryLayer = EmberLeaflet.Layer.extend({
  init: function() {
    this._super();
    this._contentDidChange();
  },

  destroy: function() {
    if (!this._super()) { return; }
    var content = get(this, 'content');
    if(content) { content.removeArrayObserver(this); }
    return this;
  },

  _contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content');
    if(content) { content.removeArrayObserver(this); }
  }, 'content'),

  _contentDidChange: Ember.observer(function() {
    var content = get(this, 'content');
    if(content) { content.addArrayObserver(this); }
  }, 'content')
});

})();



(function() {
var get = Ember.get;

/**
  `EmberLeaflet.PolylineLayer` is a polyline on the map that adjusts based
  on a content object that should be an array of LatLng objects.
 
  @class PolylineLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.PolylineLayer = EmberLeaflet.ArrayGeometryLayer.extend({
  options: {},

  locationProperty: null,

  locations: Ember.computed(function() {
    var locations = get(this, 'content') || [];
    if(get(this, 'locationProperty')) {
      locations = locations.mapProperty(get(this, 'locationProperty')); }
    locations = locations.filter(function(i) { return !!i; });
    return locations;
  }).property('content', 'locationProperty').volatile(),

  _newLayer: function() {
    return L.polyline(get(this, 'locations'), get(this, 'options'));
  },

  locationsDidChange: Ember.computed(function() {
    if(!this._layer) { return; }
    this._layer.setLatLngs(this.get('locations'));    
  }).property('locations'),

  arrayWillChange: function(array, idx, removedCount, addedCount) {},

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    if(!this._layer) { return; }
    this._layer.setLatLngs(this.get('locations'));
  }

});

})();



(function() {
/**
Ember Leaflet

@module ember-leaflet
*/

})();

