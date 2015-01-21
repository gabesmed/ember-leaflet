import Ember from 'ember';
import ContainerLayerMixin from 'ember-leaflet/mixins/container-layer';

module('ContainerLayerMixin');

// Replace this with your real tests.
test('it works', function() {
  var ContainerLayerObject = Ember.Object.extend(ContainerLayerMixin);
  var subject = ContainerLayerObject.create();
  ok(subject);
});
