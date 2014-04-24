var get = Ember.get;

/**
  `EmberLeaflet.PathBoundsLayer` is a base class that takes a list
  of locations and computed the bounding box.
 
  @class PathBoundsLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.ArrayPathLayer
*/
EmberLeaflet.PathBoundsLayer = EmberLeaflet.ArrayPathLayer.extend(
  EmberLeaflet.BoundsMixin, {});
