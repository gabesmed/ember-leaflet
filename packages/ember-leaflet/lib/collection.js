var get = Ember.get, forEach = Ember.EnumerableUtils.forEach;

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
    var removedObjects = array.slice(idx, idx + removedCount), self = this;
    forEach(removedObjects, function(obj) {
      self._removeObject(obj);
    });
  },

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    var addedObjects = array.slice(idx, idx + addedCount), self = this;
    for(var i = idx; i < idx + addedCount; i++) {
      this._addObject(array[i], i);
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
