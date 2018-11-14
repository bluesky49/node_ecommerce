function addressAutoComplete() {
  var input = document.getElementById('address');
  var latInput = document.getElementById('lat');
  var lngInput = document.getElementById('lng');
  var dropdown = new google.maps.places.Autocomplete(input);
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });
  // fix hitting enter on form fields trigging submit
  input.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) e.preventDefault();
  });
}

let mainMap;
let markers = [];
function initMap() {
  let center = { lat: 40.6298568, lng: -74.0056222 };
  mainMap = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 13,
    zoomControl: true,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false
  });

  google.maps.event.addListener(mainMap, 'zoom_changed', function() {
    let zoom = mainMap.getZoom();
    for (i = 0; i < markers.length; i++) {
      markers[i].setVisible(zoom <= 15);
    }
  });
}

function addMarker(lat, lng) {
  let center = { lat: lat, lng: lng };
  markers.push(
    new google.maps.Marker({
      position: center,
      title: 'Home Center',
      map: mainMap
    })
  );
  mainMap.setCenter(center);
}
