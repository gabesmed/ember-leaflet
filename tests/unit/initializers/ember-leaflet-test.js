import Ember from 'ember';
import { initialize } from 'ember-leaflet/initializers/leaflet-initializer';
import { module, test } from 'qunit';

var container, application;

module('EmberLeafletInitializer', {
  beforeEach: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

test('it works', function(assert) {
  initialize(container, application);

  assert.ok(typeof L.Icon.Default.imagePath !== 'undefined', "'L.Icon.Default.imagePath' is not set");
});
