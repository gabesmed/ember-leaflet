var get = Ember.get;

/**
  `EmberLeaflet.BoundingGeometryLayer` is a base class that takes a list
  of locations and computed the bounding box.
 
  @class BoundingGeometryLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.ArrayGeometryLayer
*/
EmberLeaflet.BoundingGeometryLayer = EmberLeaflet.ArrayGeometryLayer.extend(
  EmberLeaflet.BoundsMixin, {});
