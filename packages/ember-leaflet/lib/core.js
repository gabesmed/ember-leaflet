EmberLeaflet = Ember.Namespace.create();

/*
 * Queue zoom transitions
 */
if (L.DomUtil.TRANSITION) {
    L.Map.addInitHook(function() {
        L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, function() {
            var zoom = this._zoomActions.shift();
            if (zoom !== undefined) {
                this.setZoom(zoom);
            }
        }, this);
    });
}

L.Map.include(!L.DomUtil.TRANSITION ? {} : {
    _zoomActions : [],
    queueZoom : function(zoom) {
        if (this._animatingZoom) {
            this._zoomActions.push(zoom);
        } else {
            this.setZoom(zoom);
        }
    }
});
