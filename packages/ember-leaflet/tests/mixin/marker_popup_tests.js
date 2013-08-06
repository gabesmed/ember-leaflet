require('ember-leaflet/~tests/test_helper');

var marker, MarkerClass, view, 
  locationsEqual = window.locationsEqual,
  locations = window.locations;

var get = Ember.get;

module("EmberLeaflet.PopupMixin (Marker)", {
  setup: function() {
    MarkerClass = EmberLeaflet.MarkerLayer.extend(
      EmberLeaflet.PopupMixin, {});
    
    marker = MarkerClass.create({
      content: {location: locations.nyc},
      popupContent: 'hello there!'
    });

    view = EmberLeaflet.MapView.create({childLayers: [marker]});
    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
    });
  }
});

test("Popup is created", function() {
  ok(marker._popup, "popup is created");
  equal(marker._popup._map, null, "popup not added until opened");  
});

test("Clicking shows popup", function() {
  marker._layer.fire('click', {latlng: marker.get('location')});
  ok(!!marker._popup._map, "marker added to map");
  equal(marker._popup._content, 'hello there!');
  locationsEqual(marker._popup._latlng, marker.get('location'));
});

test("Destroying map destroys popup", function() {
  Ember.run(function() { view.destroy(); });
  equal(marker._popup, null);
});
