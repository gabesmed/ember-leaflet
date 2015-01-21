import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';
import locationsEqual from '../../helpers/locations-equal';

moduleForComponent('ember-leaflet', 'EmberLeafletComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

var locations = {
  nyc: L.latLng(40.713282, -74.006978),
  sf: L.latLng(37.77493, -122.419415),
  chicago: L.latLng(41.878114, -87.629798),
  paris: L.latLng(48.856614, 2.352222),
  london: L.latLng(51.511214, -0.119824),
  newdelhi: L.latLng(28.635308, 77.22496)
};

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});

test('leaflet object should be created', function() {
  var component = this.subject();
  this.append();
  ok(component._layer);
  ok(component._layer._loaded);
  equal(component.get('element')._leaflet, true);
});

test('leaflet object should have default settings', function() {
  var component = this.subject();
  this.append();
  equal(component.get('zoom'), 16);
  locationsEqual(component.get('center'), locations.nyc);
});

test('center and zoom are set on Ember object', function() {
  var component = this.subject();
  this.append();
  locationsEqual(component.get('center'), locations.nyc);
  equal(component.get('zoom'), 16);
});

test('center and zoom are set on map', function() {
  var component = this.subject();
  this.append();
  locationsEqual(component._layer.getCenter(), locations.nyc);
  equal(component._layer.getZoom(), 16);
});

test('change object center updates map', function() {
  var component = this.subject();
  this.append();
  Ember.run(function() {
    component.set('center', locations.sf);
  });
  locationsEqual(component._layer.getCenter(), locations.sf);
});

test('change object zoom updates map', function() {
  var component = this.subject();
  this.append();
  Ember.run(function() {
    component.set('zoom', 17);
  });
  equal(component._layer.getZoom(), 17);
});

test('change map center updates object', function() {
  var component = this.subject();
  this.append();
  component._layer.panTo(locations.sf);
  locationsEqual(component.get('center'), locations.sf);
});

test('change map zoom updates object', function() {
  var component = this.subject();
  this.append();
  component._layer.setZoom(17);
  equal(component.get('zoom'), 17);
});

test('two zooms in rapid succession end correctly', function() {
  var component = this.subject();
  this.append();
  expect(2);
  component.set('zoom', 17);
  stop();
  setTimeout(function() {
    component.set('zoom', 18);
    setTimeout(function() {
      equal(component.get('zoom'), 18, 'zoom correct on object');
      equal(component._layer.getZoom(), 18, 'zoom correct on map');
      start();
    }, 100);
  }, 1);
});

test('default tile layer created', function() {
  var component = this.subject();
  this.append();
  equal(component._childLayers.length, 1, 'should be created');
  equal(Ember.typeOf(component._childLayers[0]), 'instance',
    'should be instantiated');
  ok(component._childLayers[0],
    'should be a TileLayer');
  equal(component._childLayers[0]._layer._map, component._layer,
    'should be added to map');
  equal(component._childLayers[0]._layer._url, '//a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png',
    'should have tileUrl set');
});

test('don\'t create default layer if childLayers is set', function() {
  var component = this.subject();
  component.set('childLayers',[]);
  this.append();
  equal(component._childLayers.length, 0);
});

test('_destroyLayer cleans up', function() {
  var component = this.subject();
  this.append();
  Ember.run(function() {
    component._destroyLayer();
  });
  equal(component.$('.leaflet-map-pane').length, 0);
  equal(component.get('element')._leaflet, undefined);
});

test('zoom events fire', function() {
  var component = this.subject();
  expect(2);
  component.setProperties({
    zoom: 13,
    zoomstart: function() { ok(true, 'zoomstart fired'); },
    zoomend: function() { ok(true, 'zoomend fired'); start();}
  });
  stop();
  this.append();
  component._layer.setZoom(14);
});

test('move events fire', function() {
  var component = this.subject();
  expect(3);
  component.setProperties({
    zoom: 13,
    movestart: function() { ok(true, 'movestart fired'); },
    move: function() { ok(true, 'move fired'); },
    moveend: function() { ok(true, 'moveend fired');start(); }
  });
  stop();
  this.append();
  component._layer.setView(locations.paris, 13);
});

test('click events fire', function() {
  var component = this.subject();
  expect(2);
  component.setProperties({
    zoom: 13,
    options: {doubleClickZoom: false},
    center: locations.paris,
    click: function() { ok(true, 'click fired'); },
    dblclick: function() { ok(true, 'dblclick fired');start(); }
  });
  stop();
  this.append();
  component._layer.fire('click', {latlng: locations.paris});
  component._layer.fire('dblclick', {latlng: locations.paris});
});
