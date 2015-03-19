import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

moduleForComponent('ember-leaflet', 'EmberLeafletComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  assert.equal(component._state, 'inDOM');
});

test('leaflet object should be created', function(assert) {
  var component = this.subject();
  this.append();
  assert.ok(component._layer);
  assert.ok(component._layer._loaded);
  assert.equal(component.get('element')._leaflet, true);
});

test('leaflet object should have default settings', function(assert) {
  var component = this.subject();
  this.append();
  assert.equal(component.get('zoom'), 16);
  locationsEqual(assert, component.get('center'), locations.nyc);
});

test('center and zoom are set on Ember object', function(assert) {
  var component = this.subject();
  this.append();
  locationsEqual(assert, component.get('center'), locations.nyc);
  assert.equal(component.get('zoom'), 16);
});

test('center and zoom are set on map', function(assert) {
  var component = this.subject();
  this.append();
  locationsEqual(assert, component._layer.getCenter(), locations.nyc);
  assert.equal(component._layer.getZoom(), 16);
});

test('change object center updates map', function(assert) {
  var component = this.subject();
  this.append();
  Ember.run(function() {
    component.set('center', locations.sf);
  });
  locationsEqual(assert, component._layer.getCenter(), locations.sf);
});

test('change object zoom updates map', function(assert) {
  var component = this.subject();
  this.append();
  Ember.run(function() {
    component.set('zoom', 17);
  });
  assert.equal(component._layer.getZoom(), 17);
});

test('change map center updates object', function(assert) {
  var component = this.subject();
  this.append();
  component._layer.panTo(locations.sf);
  locationsEqual(assert, component.get('center'), locations.sf);
});

test('change map zoom updates object', function(assert) {
  var component = this.subject();
  this.append();
  component._layer.setZoom(17);
  assert.equal(component.get('zoom'), 17);
});

test('two zooms in rapid succession end correctly', function(assert) {
  var component = this.subject();
  this.append();
  assert.expect(2);
  component.set('zoom', 17);
  var done = assert.async();
  setTimeout(function() {
    component.set('zoom', 18);
    setTimeout(function() {
      assert.equal(component.get('zoom'), 18, 'zoom correct on object');
      assert.equal(component._layer.getZoom(), 18, 'zoom correct on map');
      done();
    }, 200);
  }, 1);
});

test('default tile layer created', function(assert) {
  var component = this.subject();
  this.append();
  assert.equal(component._childLayers.length, 1, 'should be created');
  assert.equal(Ember.typeOf(component._childLayers[0]), 'instance',
    'should be instantiated');
  assert.ok(component._childLayers[0],
    'should be a TileLayer');
  assert.equal(component._childLayers[0]._layer._map, component._layer,
    'should be added to map');
  assert.equal(component._childLayers[0]._layer._url, '//a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png',
    'should have tileUrl set');
});

test('don\'t create default layer if childLayers is set', function(assert) {
  var component = this.subject();
  component.set('childLayers',[]);
  this.append();
  assert.equal(component._childLayers.length, 0);
});

test('_destroyLayer cleans up', function(assert) {
  var component = this.subject();
  this.append();
  Ember.run(function() {
    component._destroyLayer();
  });
  assert.equal(component.$('.leaflet-map-pane').length, 0);
  assert.equal(component.get('element')._leaflet, undefined);
});

test('zoom events fire', function(assert) {
  var component = this.subject();
  assert.expect(2);
  var done = assert.async();
  component.setProperties({
    zoom: 13,
    zoomstart: function() { assert.ok(true, 'zoomstart fired'); },
    zoomend: function() { assert.ok(true, 'zoomend fired'); done();}
  });
  this.append();
  component._layer.setZoom(14);
});

test('move events fire', function(assert) {
  var component = this.subject();
  assert.expect(3);
  var done = assert.async();
  component.setProperties({
    zoom: 13,
    movestart: function() { assert.ok(true, 'movestart fired'); },
    move: function() { assert.ok(true, 'move fired'); },
    moveend: function() { assert.ok(true, 'moveend fired'); done(); }
  });
  this.append();
  component._layer.setView(locations.paris, 13);
});

test('click events fire', function(assert) {
  var component = this.subject();
  assert.expect(2);
  var done = assert.async();
  component.setProperties({
    zoom: 13,
    options: {doubleClickZoom: false},
    center: locations.paris,
    click: function() { assert.ok(true, 'click fired'); },
    dblclick: function() { assert.ok(true, 'dblclick fired');done(); }
  });
  this.append();
  component._layer.fire('click', {latlng: locations.paris});
  component._layer.fire('dblclick', {latlng: locations.paris});
});
