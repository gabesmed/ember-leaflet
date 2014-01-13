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

  concatenatedProperties: ['events'],

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
