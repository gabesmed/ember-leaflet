import Ember from 'ember';
import MarkerLayer from '../../../layers/marker';
import PolygonLayer from '../../../layers/polygon';
import PopupMixin from '../../../mixins/popup';
import { moduleForComponent, test } from 'ember-qunit';

import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var marker, MarkerClass, component,
  firstPopupContent = 'hello there!',
  secondPopupContent = 'salutations!';

moduleForComponent('leaflet-map', 'MarkerLayer with PopupMixin', {
  beforeEach: function() {
    MarkerClass = MarkerLayer.extend(PopupMixin, {});

    marker = MarkerClass.create({
      content: {location: locations.nyc},
      popupContent: firstPopupContent
    });

    component = this.subject();
    component.set('childLayers', [marker]);
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
  assert.equal(marker._popup._content, firstPopupContent, 'popup content set');
  locationsEqual(assert, marker._popup._latlng, marker.get('location'));
});

test('Popup content updates', function(assert) {
  marker._layer.fire('click', {latlng: marker.get('location')});
  assert.equal(marker._popup._content, firstPopupContent, 'popup content initially set');
  marker.set('popupContent', secondPopupContent);
  assert.equal(marker._popup._content, secondPopupContent, 'popup content updates');
});

test('Destroying map destroys popup', function(assert) {
  Ember.run(function() { component.destroy(); });
  assert.equal(marker._popup, null);
});

var content, PolygonClass, polygon;

moduleForComponent('leaflet-map', 'PolygonLayer with PopupMixin', {
  beforeEach: function() {
    content = Ember.A([locations.sf, locations.chicago, locations.nyc]);
    PolygonClass = PolygonLayer.extend(PopupMixin, {});

    polygon = PolygonClass.create({
      content: content,
      popupContent: 'hello there!'
    });

    component = this.subject();
    component.set('childLayers', [polygon]);
    this.render();
  }
});

test('Popup is created', function(assert) {
  assert.ok(polygon._popup, 'popup is created');
  assert.equal(polygon._popup._map, null, 'popup not added until opened');
});

test('Clicking shows popup', function(assert) {
  var latlng = L.latLngBounds(polygon.get('locations')).getCenter();
  polygon._layer.fire('click', {
    latlng: latlng
  });
  assert.ok(!!polygon._popup._map, 'popup added to map');
  assert.equal(polygon._popup._content, 'hello there!');
  locationsEqual(assert, polygon._popup._latlng, latlng);
});

test('Destroying map destroys popup', function(assert) {
  Ember.run(function() { component.destroy(); });
  assert.equal(polygon._popup, null);
});
