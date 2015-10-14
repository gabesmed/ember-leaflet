import Ember from 'ember';
import ContainerLayer from './container';

const { get, computed } = Ember;

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

  itemLayerClass: computed(function() {
    throw new Error("itemLayerClass must be defined.");
  }),

  didCreateLayer() {
    this._super();
    this._contentDidChange();
  },

  willDestroyLayer() {
    this._clear();
    this._super();
  },

  _contentDidChange: Ember.observer('content', function() {
    this._clear();
    const content = get(this, 'content');
    if (!content) { return; }
    content.addArrayObserver(this);
    this._content = content;
    const len = get(content, 'length');
    this.arrayDidChange(content, 0, null, len);
  }),

  _clear() {
    if (!this._content) { return; }
    this._content.removeArrayObserver(this);
    this.arrayWillChange(this._content, 0, get(this._content, 'length'));
    this._content = null;
  },

  arrayWillChange(array, idx, removedCount) {
    for(let i = idx; i < idx + removedCount; i++) {
      this.objectWasRemoved(array.objectAt(i));
    }
  },

  arrayDidChange(array, idx, removedCount, addedCount) {
    for(let i = idx; i < idx + addedCount; i++) {
      this.objectWasAdded(array.objectAt(i), i);
    }
  },

  objectWasAdded(obj, index) {
    if(index === undefined) { index = this._childLayers.length; }
    const childLayer = this.createChildLayer(get(this, 'itemLayerClass'), {
      content: obj
    });
    this.replace(index, 0, [childLayer]);
  },

  objectWasRemoved(obj) {
    for(let i = 0, l = this._childLayers.length; i < l; i++) {
      const layer = this._childLayers[i];
      if(layer.get('content') === obj) {
        this.replace(i, 1, []);
        layer.destroy();
        return;
      }
    }
  }
});
