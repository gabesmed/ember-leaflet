import Ember from 'ember';

var get = Ember.get, set = Ember.set, setProperties = Ember.setProperties;

/**
 * `DraggableMixin` adds drag and drop functionality to
 * `MarkerLayer` classes.
 *
 * @class DraggableMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
  isDragging: false,
  isDraggable: true,

  dragstart: function() {
    set(this, 'isDragging', true);
  },

  dragend: function() {
    setProperties(this, {
      location: this._layer.getLatLng(),
      isDragging: false
    });
  },

  _updateDraggability: Ember.observer(function() {
    if(!this._layer || !this._layer._map) { return; }
    if(get(this, 'isDraggable')) {
      this._layer.dragging.enable();
    } else {
      this._layer.dragging.disable();
    }
  }, 'isDraggable', 'layer')
});
