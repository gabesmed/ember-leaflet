require("ember-leaflet/collection/observe_content");

var get = Ember.get, forEach = Ember.EnumerableUtils.forEach;

/**
  `EmberLeaflet.CollectionLayer` is the equivalent of `Ember.CollectionView`
  for DOM views -- it observes the `content` array for updates and maintains
  a list of child layers associated with the content array.
 
  @class CollectionLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.CollectionLayer = EmberLeaflet.Layer.extend(
    /*Ember.MutableArray, */
    EmberLeaflet.ObserveContentArrayMixin, {
  content: [],

  // replace: function(idx, removedCount, addedLayers) {
  //   this.arrayContentWillChange(idx, removedCount, addedLayers);
  // },

  // objectAt: function(idx) {
  //   return this._childLayers[idx];
  // },

  // length: Ember.computed(function() {
  //   return this._childLayers.length;
  // }),

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

  arrayWillChange: function(array, idx, removedCount, addedCount) {
    for(var i = idx; i < idx + removedCount; i++) {
      this._removeObject(array.objectAt(i));
    }
  },

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    for(var i = idx; i < idx + addedCount; i++) {
      this._addObject(array.objectAt(i), i);
    }
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
    this._childLayers = [];
    forEach(get(this, 'content'), function(obj) {
      self._addObject(obj);
    });
  },

  _addObject: function(obj, index) {
    if(index === undefined) { index = this._childLayers.length; }
    var childLayer = this._createChildLayer(get(this, 'itemLayerClass'), {
      content: obj
    });
    this._childLayers.splice.call(this._childLayers, index, 0, childLayer);
  },

  _removeObject: function(obj) {
    var layer;
    for(var i = 0, l = this._childLayers.length; i < l; i++) {
      layer = this._childLayers[i];
      if(layer.get('content') === obj) {
        layer._destroyLayer();
        layer.destroy();
        this._childLayers.splice(i, 1);
        return;
      }
    }
  }  
});
