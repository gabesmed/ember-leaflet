import Ember from 'ember';
import MarkerLayer from 'ember-leaflet/layers/marker';
import PopupMixin from 'ember-leaflet/mixins/popup';
import { moduleForComponent, test } from 'ember-qunit';

import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var App, marker, MarkerClass, component, controller;

var get = Ember.get;

moduleForComponent('leaflet-map', 'PopupMixin (Marker with complex popupViewClass)', {
  beforeEach: function() {

    MarkerClass = MarkerLayer.extend(PopupMixin, {});

    var template = Ember.Handlebars.compile(
      '{{#if isActivated}}' +
        '{{#each item in items}}' +
          '#{{item.number}},' +
        '{{/each}}' +
      '{{else}}' +
        'not activated' +
      '{{/if}}');

    controller = Ember.Controller.create({
      isActivated: true,
      items: Ember.A([{number: 40}, {number: 70}])
    });

    var PopupViewClass = Ember.View.extend({
      template: template,
    });

    marker = MarkerClass.create({
      content: {location: locations.nyc},
      popupViewClass: PopupViewClass
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
    '#40,#70,', 'popup content set');
});

test('Popup content updates', function(assert) {
  marker._layer.fire('click', {latlng: marker.get('location')});
  Ember.run(function() {
    controller.set('isActivated', false);
  });
  assert.equal(Ember.$(marker._popup._contentNode).text(),
    'not activated', 'popup content updated');
  Ember.run(function() {
    controller.set('isActivated', true);
    controller.get('items').pushObject({number: 20});
  });
  assert.equal(Ember.$(marker._popup._contentNode).text(),
    '#40,#70,#20,', 'popup content updated');
});

test('Closing popup destroys view', function(assert) {
  marker._layer.fire('click', {latlng: marker.get('location')});
  var popupView = marker._popupView;
  assert.ok(popupView, 'popup view created');
  Ember.run(function() {
    component._layer.closePopup();
  });
  assert.equal(marker._popupView, null, 'popupView is nullified');
  assert.equal(popupView.isDestroyed, true, 'popup view is destroyed');
});
