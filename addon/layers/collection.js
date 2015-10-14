import Ember from 'ember';
import ContainerLayer from './container';

var get = Ember.get;

/**
 * `CollectionLayer` is the equivalent of `Ember.CollectionView`
 * for DOM views -- it observes the `content` array for updates and maintains
 * a list of child layers associated with the content array.

 * @class CollectionLayer
 * @extends ContainerLayer
 */
export default ContainerLayer.extend({
  content: [],
  isVirtual: true,

  itemLayerClass: Ember.computed(function() {
    throw new Error("itemLayerClass must be defined.");
  }).property(),

  didCreateLayer: function() {
    this._super();
    this._contentDidChange();
  },

  willDestroyLayer: function() {
    this._clear();
    this._super();
  },

  _contentDidChange: Ember.observer('content', function() {
    this._clear();
    var content = get(this, 'content');
    if (!content) { return; }
    content.addArrayObserver(this);
    this._content = content;
    var len = get(content, 'length');
    this.arrayDidChange(content, 0, null, len);
  }),

  _clear: function() {
    if (!this._content) { return; }
    this._content.removeArrayObserver(this);
    this.arrayWillChange(this._content, 0, get(this._content, 'length'));
    this._content = null;
  },

  arrayWillChange: function(array, idx, removedCount) {
    for(var i = idx; i < idx + removedCount; i++) {
      this.objectWasRemoved(array.objectAt(i));
    }
  },

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    for(var i = idx; i < idx + addedCount; i++) {
      this.objectWasAdded(array.objectAt(i), i);
    }
  },

  objectWasAdded: function(obj, index) {
    if(index === undefined) { index = this._childLayers.length; }
    var childLayer = this.createChildLayer(get(this, 'itemLayerClass'), {
      content: obj
    });
    this.replace(index, 0, [childLayer]);
  },

  objectWasRemoved: function(obj) {
    var layer;
    for(var i = 0, l = this._childLayers.length; i < l; i++) {
      layer = this._childLayers[i];
      if(layer.get('content') === obj) {
        this.replace(i, 1, []);
        layer.destroy();
        return;
      }
    }
  }
});
