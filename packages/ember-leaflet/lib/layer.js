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
      "%@ layer must support adding objects.".fmt(this.toString()),
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

EmberLeaflet.Layer = Ember.Object.extend(EmberLeaflet.LayerMixin, {});
