require('ember-leaflet/~tests/test_helper');

var view, f, locations = window.locations;

module("EmberLeaflet.MapView events", {
  setup: function() {},
  teardown: function() {
    Ember.run(function() { if(view) { view.destroy(); view = null; } });
  }
});

test("zoom events fire", function() {
  expect(2);
  view = EmberLeaflet.MapView.create({
    zoom: 13,
    zoomstart: function() { ok(true, "zoomstart fired"); },
    zoomend: function() { ok(true, "zoomend fired"); }
  });
  Ember.run(function() { view.appendTo('#qunit-fixture'); });
  view._layer.setZoom(14);
});

test("move events fire", function() {
  expect(3);
  view = EmberLeaflet.MapView.create({
    zoom: 13,
    movestart: function() { ok(true, "movestart fired"); },
    move: function() { ok(true, "move fired"); },
    moveend: function() { ok(true, "moveend fired"); }
  });
  Ember.run(function() { view.appendTo('#qunit-fixture'); });
  view._layer.setView(locations.paris, 13);
});

test("click events fire", function() {
  expect(2);
  view = EmberLeaflet.MapView.create({
    zoom: 13,
    options: {doubleClickZoom: false},
    center: locations.paris,
    click: function() { ok(true, "click fired"); },
    dblclick: function() { ok(true, "dblclick fired"); }
  });
  Ember.run(function() { view.appendTo('#qunit-fixture'); });
  view._layer.fire('click', {latlng: locations.paris});
  view._layer.fire('dblclick', {latlng: locations.paris});
});
