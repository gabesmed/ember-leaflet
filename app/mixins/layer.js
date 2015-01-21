import Ember from 'ember';

var fmt = Ember.String.fmt, forEach = Ember.EnumerableUtils.forEach,
  get = Ember.get;

/**
  `EmberLeaflet.LayerMixin` provides basic functionality for the Ember
  wrapper of Leaflet layers, including instantiating child and parent layers.
  @class LayerMixin
  @namespace EmberLeaflet
*/
export default Ember.Mixin.create({
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
