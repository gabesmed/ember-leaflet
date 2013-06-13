var get = Ember.get;

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
    var removedObjects = array.slice(idx, idx + removedCount);
    var removeLayers = this._childLayers.slice(idx, idx + removedCount);
    removeLayers.invoke('_destroyLayer');
    removeLayers.invoke('destroy');
    this._childLayers.splice(idx, removedCount);
  },

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    var addedObjects = array.slice(idx, idx + addedCount), self = this;
    var addedLayers = addedObjects.map(function(obj) {
      return self._layerForObject(obj);
    });
    var args = [idx, 0].concat(addedLayers);
    this._childLayers.splice.apply(this._childLayers, args);
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
    this._childLayers = get(this, 'content').map(function(obj) {
      return self._layerForObject(obj);
    });
  },

  _layerForObject: function(obj) {
    return this._createChildLayer(get(this, 'itemLayerClass'), {
      content: obj
    });
  }
});
