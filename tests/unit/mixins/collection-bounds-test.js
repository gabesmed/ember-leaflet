import Ember from 'ember';
import CollectionLayer from '../../../layers/collection';
import CollectionBoundsMixin from '../../../mixins/collection-bounds';
import EmptyLayer from '../../../layers/empty';
import { moduleForComponent, test } from 'ember-qunit';

var component, collection, content;
var n = [-15.780148, -47.92917],
    w = [-15.782102, -47.936869],
    s = [-15.786108, -47.931933],
    e = [-15.783423, -47.924638];

moduleForComponent('leaflet-map', 'CollectionBounds', {
  beforeEach: function() {
    content = Ember.A([
      L.latLng(n), L.latLng(w), L.latLng(s), null, L.latLng(e)
    ]);
    var collectionClass = CollectionLayer.extend(CollectionBoundsMixin, {
      itemLayerClass: EmptyLayer.extend({
        location: Ember.computed.alias('content')
      }),
      content: content
    });
    component = this.subject();
    component.set('childLayers', [collectionClass]);
    this.render();

    collection = component._childLayers[0];
  }
});

test('bounds reflect locations of content items', function(assert) {
  var bounds = collection.get('bounds');
  assert.ok(bounds, 'bounds should be initialized');
  assert.equal(bounds.getSouth(), s[0]);
  assert.equal(bounds.getNorth(), n[0]);
  assert.equal(bounds.getWest(), w[1]);
  assert.equal(bounds.getEast(), e[1]);
});
