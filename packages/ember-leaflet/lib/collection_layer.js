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
    this.contentDidChange();
  },

  contentWillChange: Ember.beforeObserver(function() {
    if(get(this, 'content')) {
      get(this, 'content').removeArrayObserver(this); }
  }, 'content'),

  contentDidChange: Ember.observer(function() {
    if(get(this, 'content')) {
      get(this, 'content').addArrayObserver(this); }
  }, 'content'),

  arrayWillChange: function(array, idx, removedCount, addedCount) {
    var removedLayers = array.slice(idx, idx + removedCount);
    this._childLayers.slice(idx, idx + removedCount).invoke('_destroyLayer');
    this._childLayers.splice(idx, removedCount);
  },

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    var addedObjects = array.slice(idx, idx + addedCount), self = this;
    this._childLayers.slice.apply(this, ([idx, 0]
      .concat(addedObjects.map(function(obj) {
        return self._layerForObject(obj);
      }))));
  },

  _createLayer: function() {
    this._layer = get(this, 'parentLayer')._layer;
    this._createChildLayers();
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
