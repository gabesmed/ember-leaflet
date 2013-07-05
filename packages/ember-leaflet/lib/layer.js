var fmt = Ember.String.fmt;

var childLayersProperty = Ember.computed(function() {
  return this._childLayers;
}).property();

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

  /**
    @private

    Reference to parent layer. Never set directly.

    @property childLayers
    @type Array
    @default []
  */
  parentLayer: Ember.computed.alias('_parentLayer').readOnly(),

  /**
    @private

    Array of child views. You should never edit this array directly.

    @property childLayers
    @type Array
    @default []
  */
  childLayers: childLayersProperty,
  
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
    this.propertyWillChange('layer');
    this._layer = this._newLayer();
    this._parentLayer._layer.addLayer(this._layer);
    this.propertyDidChange('layer');
    this.didCreateLayer();
    this._createChildLayers();
  },

  _destroyLayer: function() {
    Ember.assert("Layer must exist.", !!this._layer);
    this._destroyChildLayers();
    this.willDestroyLayer();
    this.propertyWillChange('layer');
    try {
      this._parentLayer._layer.removeLayer(this._layer);
    } catch(err) {
      Ember.Logger.warn("Error removing layer on " + this.constructor);
    }
    this._layer = null;
    this.propertyDidChange('layer');
    this.didDestroyLayer();
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
    Ember.defineProperty(this, 'childLayers', childLayersProperty);
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
    layerInstance._createLayer();
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
