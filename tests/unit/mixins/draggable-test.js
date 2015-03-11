import Ember from 'ember';
import MarkerLayer from '../../../layers/marker';
import DraggableMixin from '../../../mixins/draggable';
import EmptyLayer from '../../../layers/empty';
import { moduleForComponent, test } from 'ember-qunit';

import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var marker, MarkerClass, component;

moduleForComponent('ember-leaflet', 'DraggableMixin', {
  beforeEach: function() {
    MarkerClass = MarkerLayer.extend(DraggableMixin, {});

    marker = MarkerClass.create({
      content: {location: locations.nyc}
    });

    component = this.subject();
    component.set('childLayers', [marker]);
    this.render();
  }
});

test('Can drag marker', function(assert) {
  assert.ok(marker._layer._map, 'added to map');
  assert.ok(Ember.get(marker, 'isDraggable'), 'isDraggable property set');
  assert.ok(marker._layer.dragging.enabled(), 'marker dragging enabled');
});

test('Update location on drag', function(assert) {
  assert.expect(3);
  // Expect listeners to be fired.
  Ember.addListener(marker, 'location:before', this, function() {
    assert.ok(true, 'before listener fired');
  }, true);
  Ember.addListener(marker, 'location:change', this, function() {
    assert.ok(true, 'listener fired');
  }, true);
  marker._layer.fire('dragstart');
  marker._layer._latlng = locations.sf;
  marker._layer.fire('dragend');
  locationsEqual(assert, Ember.get(marker, 'location'), locations.sf);
});

test('disable dragging in object disables on layer', function(assert) {
  marker.set('isDraggable', false);
  assert.equal(marker._layer.dragging.enabled(), false, 'dragging disabled');
});
