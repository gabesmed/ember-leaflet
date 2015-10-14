import Ember from 'ember';
import ContainerLayer from './container';

const { get } = Ember;

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

  didCreateLayer() {
    this._super();
    this._contentDidChange();
  },

  willDestroyLayer() {
    this._contentWillChange();
    this._super();
  },

  _contentWillChange: Ember.beforeObserver('content', function() {
    const content = get(this, 'content');
    if(content) { content.removeArrayObserver(this); }
    const len = content ? get(content, 'length') : 0;
    this.arrayWillChange(content, 0, len);
  }),

  _contentDidChange: Ember.observer('content', function() {
    const content = get(this, 'content');
    if(content) { content.addArrayObserver(this); }
    const len = content ? get(content, 'length') : 0;
    this.arrayDidChange(content, 0, null, len);
  }),

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
