require('ember-leaflet/~tests/test_helper');

var marker, MarkerClass, view, 
  locationsEqual = window.locationsEqual,
  locations = window.locations;

var get = Ember.get;

module("EmberLeaflet.DraggableMixin", {
  setup: function() {
    MarkerClass = EmberLeaflet.MarkerLayer.extend(
      EmberLeaflet.DraggableMixin, {});
    
    marker = MarkerClass.create({
      content: {location: locations.nyc}
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

test("Can drag marker", function() {
  ok(marker._layer._map, "added to map");
  ok(get(marker, 'isDraggable'), "isDraggable property set");
  ok(marker._layer.dragging.enabled(), "marker dragging enabled");
});

test("Update location on drag", function() {
  expect(3);
  // Expect listeners to be fired.
  Ember.addListener(marker, 'location:before', this, function() {
    ok(true, "before listener fired");
  }, true);
  Ember.addListener(marker, 'location:change', this, function() {
    ok(true, "listener fired");
  }, true);
  marker._layer.fire('dragstart');
  marker._layer._latlng = locations.sf;
  marker._layer.fire('dragend');
  locationsEqual(get(marker, 'location'), locations.sf);
});

test("disable dragging in object disables on layer", function() {
  marker.set('isDraggable', false);
  equal(marker._layer.dragging.enabled(), false, "dragging disabled");
});
