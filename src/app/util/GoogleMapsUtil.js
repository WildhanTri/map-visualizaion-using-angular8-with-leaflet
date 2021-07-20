
const fitBounds = (map, markers) => {
    let bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].getPosition().lat() != "NaN" && markers[i].getPosition().lng() != "NaN") {
        bounds.extend(new google.maps.LatLng(markers[i].getPosition().lat(), markers[i].getPosition().lng()));
      }
    }
    map.fitBounds(bounds);
    map.setZoom(map.getZoom());
}

module.exports = {fitBounds}