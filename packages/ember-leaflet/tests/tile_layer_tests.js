var view;

module("EmberLeaflet.TileLayer", {
  setup: function() {
    view = EmberLeaflet.MapView.create({
      childLayers: [
        EmberLeaflet.TileLayer.extend({
          tileUrl: 'http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png'
        })]
    });
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

test("tile layer is added", function() {
  var tileLayer = view._childLayers[0];
  equal(tileLayer._layer._url, 'http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png');
});
