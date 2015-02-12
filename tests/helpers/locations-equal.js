//TODO better way to define custom test helpers
export default function (loc1, loc2) {
  var msg = '', isEqual = false;
  if(!loc1) { msg = 'First location was null'; }
  else if(!loc2) { msg = 'Second location was null'; }
  else if(loc1.lat !== loc2.lat) {
    msg = 'Latitude ' + loc1.lat + ' did not match ' + loc2.lat; }
  else if(loc1.lng !== loc2.lng) {
    msg = 'Longitude ' + loc1.lng + ' did not match ' + loc2.lng; }
  else { isEqual = true; }
  ok(isEqual, msg);
}
