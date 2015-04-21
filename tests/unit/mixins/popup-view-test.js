import Ember from 'ember';
import MarkerLayer from 'ember-leaflet/layers/marker';
import PopupMixin from 'ember-leaflet/mixins/popup';
import { moduleForComponent, test } from 'ember-qunit';

import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var marker, MarkerClass, component, PopupViewClass, controller;

var get = Ember.get;

moduleForComponent('leaflet-map', 'PopupMixin (Marker with popupViewClass)', {
  beforeEach: function() {
    PopupViewClass = Ember.View.extend({
      template: Ember.Handlebars.compile('value: {{value}}')
    });

    MarkerClass = MarkerLayer.extend(PopupMixin, {});

    marker = MarkerClass.create({
      content: {location: locations.nyc},
      popupViewClass: PopupViewClass
    });

    controller = Ember.Controller.create({
      value: true
    });

    component = this.subject();
    component.setProperties({
      childLayers: [marker],
      controller: controller
    });
    this.render();
  }
});

test('Popup is created', function(assert) {
  assert.ok(marker._popup, 'popup is created');
  assert.equal(marker._popup._map, null, 'popup not added until opened');
});

test('Clicking shows popup', function(assert) {
  marker._layer.fire('click', {latlng: marker.get('location')});
  assert.ok(!!marker._popup._map, 'marker added to map');
  locationsEqual(assert, marker._popup._latlng, marker.get('location'));
  assert.equal(Ember.$(marker._popup._contentNode).text(),
    'value: true', 'popup content set');
});

test('Popup content updates', function(assert) {
  marker._layer.fire('click', {latlng: marker.get('location')});
  Ember.run(function() {
    controller.set('value', false);
  });
  assert.equal(Ember.$(marker._popup._contentNode).text(),
    'value: false', 'popup content updated');
});

test('Closing popup destroys componente', function(assert) {
  marker._layer.fire('click', {latlng: marker.get('location')});
  var popupView = marker._popupView;
  assert.ok(popupView, 'popup view created');
  Ember.run(function() {
    component._layer.closePopup();
  });
  assert.equal(marker._popupView, null, 'popupView is nullified');
  assert.equal(popupView.isDestroyed, true, 'popup view is destroyed');
});
