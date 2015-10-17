import Ember from 'ember';
import LayerMixin from './layer';

const { get } = Ember;

/**
 * A `ContainerLayerMixin` is a `Layer` mixin that implements
 * `Ember.MutableArray` allowing programatic management
 * of its child layers.
 *
 * @class ContainerLayerMixin
 * @extends Ember.Mixin
 * @uses LayerMixin
 * @uses Ember.MutableArray
 */
export default Ember.Mixin.create(
    LayerMixin, Ember.MutableArray, {
  /**
  Initialize child layers from the class variable. This should only be
  called once.
  */

  _childLayers: null,

  didCreateLayer() {
    this._super();
    this.createAndAddChildLayers();
  },

  willDestroyLayer() {
    this.removeAndDestroyChildLayers();
    this._super();
  },

  createAndAddChildLayers() {
    const _childLayers = this._childLayers = Ember.A(), self = this;
    let layer;
    if(this._childLayerClasses === undefined) {
      this._childLayerClasses = get(this, 'childLayers') || [];
    }
    Ember.defineProperty(this, 'childLayers', Ember.computed(function() {
      return this._childLayers;
    }));

    this._childLayerClasses.forEach(function(layerClass, idx) {
      layer = self.createChildLayer(layerClass);
      self.addChildLayer(layer);
      _childLayers[idx] = layer;
    }, this);
  },

  replace(idx, removedCount, addedLayers) {
    const addedCount = addedLayers ? get(addedLayers, 'length') : 0,
      self = this;
    this.arrayContentWillChange(idx, removedCount, addedCount);
    this.childLayersWillChange(this._childLayers, idx, removedCount);

    if (addedCount === 0) {
      this._childLayers.splice(idx, removedCount);
    } else {
      // instantiate class objects, make sure controller and
      // _parentLayer is set for each layer object added.
      addedLayers = addedLayers.map(function(layer) {
        return self.createChildLayer(layer);
      });
      const args = [idx, removedCount].concat(addedLayers);
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

  objectAt(idx) {
    return this._childLayers[idx];
  },

  length: Ember.computed(function () {
    return this._childLayers.length;
  }),

  childLayersWillChange(layers, start, removed) {
    this.propertyWillChange('childLayers');
    if(removed > 0) {
      var removedLayers = layers.slice(start, start + removed);
      removedLayers.forEach((layer) => this.removeChildLayer(layer));
    }
  },

  childLayersDidChange(layers, start, removed, added) {
    if(added > 0) {
      var addedLayers = layers.slice(start, start + added);
      addedLayers.forEach((layer) => this.addChildLayer(layer));
    }
    this.propertyDidChange('childLayers');
  },

  addChildLayer(layer) {
    layer._createLayer();
  },

  removeChildLayer(layer) {
    layer._destroyLayer();
  },

  createChildLayer(layerClass, attrs) {
    attrs = attrs || {};
    attrs.container = this.get('container');
    attrs.controller = this.get('controller');
    attrs._parentLayer = this.isVirtual ? this._parentLayer : this;
    let layerInstance;
    const layerType = Ember.typeOf(layerClass);
    const layerClassName = layerClass ? layerClass.toString() : '<undefined>';
    Ember.assert(
      `layerClass ${layerClassName} must be an Ember instance or class.`,
        layerType === 'instance' || layerType === 'class');
    if(layerType === 'instance') {
      layerInstance = layerClass;
      layerInstance.setProperties(attrs);
    } else if (layerType === 'class'){
      layerInstance = layerClass.create(attrs);
    }
    return layerInstance;
  },

  removeAndDestroyChildLayers() {
    if(this._childLayers) {
      this._childLayers.forEach((layer) => {
        this.removeChildLayer(layer);
        layer.destroy();
      });
    }
    this._childLayers = [];
  }
});
