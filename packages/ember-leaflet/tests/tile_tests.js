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

test('update url', function() {
  var tileLayer = view._childLayers[0];
  tileLayer.set('tileUrl', 'newUrl');
  equal(tileLayer._layer._url, 'newUrl');
});

test('update opacity', function() {
  var tileLayer = view._childLayers[0];
  tileLayer.set('opacity', 0.5);
  equal(tileLayer._layer.options.opacity, 0.5);
});

test('update zIndex', function() {
  var tileLayer = view._childLayers[0];
  tileLayer.set('zIndex', 100);
  equal(tileLayer._layer.options.zIndex, 100);
});
