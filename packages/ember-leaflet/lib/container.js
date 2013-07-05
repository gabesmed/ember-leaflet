var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt,
  forEach = Ember.EnumerableUtils.forEach;

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
  initChildLayers: function() {
    var childLayerClasses = get(this, 'childLayers');

    // redefine view's childLayers property that was obliterated
    Ember.defineProperty(this, 'childLayers', Ember.computed(function() {
      return this._childLayers;
    }).property());

    var _childLayers = this._childLayers;

    forEach(childLayerClasses, function(layerClass, idx) {
      _childLayers[idx] = this.createChildLayer(layerClass);
    }, this);
  },

  replace: function(idx, removedCount, addedLayers) {
    var addedCount = addedLayers ? get(addedLayers, 'length') : 0;
    this.arrayContentWillChange(idx, removedCount, addedCount);
    this.childViewsWillChange(this._childLayers, idx, removedCount);

    if (addedCount === 0) {
      this._childLayers.splice(idx, removedCount);
    } else {
      var args = [idx, removedCount].concat(addedLayers);
      if (addedLayers.length && !this._childLayers.length) {
        this._childLayers = this._childLayers.slice(); }
      this._childLayers.splice.apply(this._childLayers, args);
    }

    this.arrayContentDidChange(idx, removedCount, addedCount);
    this.childViewsDidChange(this._childLayers, idx, removedCount,
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
        self.destroyChildLayer(layer);
      });
    }
  },

  childLayersDidChange: function(layers, start, removed, added) {
    var self = this;
    if(added > 0) {
      var addedLayers = layers.slice(start, start + added);
      forEach(addedLayers, function(layer) {
        self.createChildLayer(layer);
      });
    }
    this.propertyDidChange('childLayers');
  },

  createChildLayer: function(layerClass, attrs) {
    attrs = attrs || {};
    attrs.controller = this.get('controller');
    attrs._parentLayer = this;
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
    layerInstance._createLayer();
    return layerInstance;
  },

  destroyChildLayer: function(layer) {
    layer._destroyLayer();
    layer.destroy();    
  },

  destroyChildLayers: function() {
    var self = this;
    forEach(this._childLayers, function(layer) {
      self.destroyChildLayer(layer);
    });
    this._childLayers = [];
  }

});

EmberLeaflet.ContainerLayer = Ember.Object.extend(
    EmberLeaflet.ContainerLayerMixin, {
  init: function() {
    this._super();
    this.initChildLayers();
  },

  destroy: function() {
    this.destroyChildLayers();
    this._super();
  }
});
