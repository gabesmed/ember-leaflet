import Ember from 'ember';
import LayerMixin from 'ember-leaflet/mixins/layer';

module('LayerMixin');

// Replace this with your real tests.
test('it works', function() {
  var LayerObject = Ember.Object.extend(LayerMixin);
  var subject = LayerObject.create();
  ok(subject);
});
