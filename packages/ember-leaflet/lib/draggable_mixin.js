var get = Ember.get, set = Ember.set, setProperties = Ember.setProperties;

/**
DraggableMixin
*/
EmberLeaflet.DraggableMixin = Ember.Mixin.create({
  isDragging: true,
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

  isDraggableDidChange: Ember.observer(function() {
    if(!this._layer || !this._layer._map) { return; }
    if(get(this, 'isDraggable')) {
      this._layer.dragging.enable();
    } else {
      this._layer.dragging.disable();
    }
  }, 'isDraggable'),

  layerWillChange: Ember.beforeObserver(function() {
    if(!this._layer) { return; }
    this._layer.off('dragstart', this.dragstart, this);
    this._layer.off('dragend', this.dragend, this);
  }, 'layer'),

  layerDidChange: Ember.observer(function() {
    if(!this._layer) { return; }
    this._layer.on('dragstart', this.dragstart, this);
    this._layer.on('dragend', this.dragend, this);
    this.propertyDidChange('isDraggable');
  }, 'layer')

});
