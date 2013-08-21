var view, collection, content;

var n = [-15.780148, -47.92917],
    w = [-15.782102, -47.936869],
    s = [-15.786108, -47.931933],
    e = [-15.783423, -47.924638];


module("EmberLeaflet.CollectionBoundsMixin", {
  setup: function() {
    content = Ember.A([
      L.latLng(n), L.latLng(w), L.latLng(s), null, L.latLng(e)]);
    var collectionClass = EmberLeaflet.CollectionLayer.extend(
        EmberLeaflet.CollectionBoundsMixin, {
      itemLayerClass: EmberLeaflet.EmptyLayer.extend({
        location: Ember.computed.alias('content')
      }),
      content: content
    });
    view = EmberLeaflet.MapView.create({
      childLayers: [collectionClass]
    });
    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
    collection = view._childLayers[0];
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();      
    });
  }
});

test("bounds reflect locations of content items", function() {
  var bounds = collection.get('bounds');
  ok(bounds, "bounds should be initialized");
  equal(bounds.getSouth(), s[0]);
  equal(bounds.getNorth(), n[0]);
  equal(bounds.getWest(), w[1]);
  equal(bounds.getEast(), e[1]);
});
