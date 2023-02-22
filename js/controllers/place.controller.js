let gMap = null;
let gMarkers = [];

function onInit() {
  renderUserPref();
  renderPlaces();
}

function renderPlaces() {
  const places = getPlaces();
  const elList = document.querySelector('.place-list');
  let strHtmls = places
    .map(({ id, name }) => {
      return `
        <li>
        <h4>${name}</h4>
        <span class="close-btn" onclick="onRemovePlace('${id}')">❌</span>
        <span class="go-btn" onclick="onPanToPlace('${id}')">GO</span>
      </li>
        `;
    })
    .join('');
  elList.innerHTML = strHtmls;
}

function onRemovePlace(placeId) {
  removePlace(placeId);
  renderPlaces();
  renderMarkers();
}

window.initMap = initMap;

// Initialize and add the map
function initMap() {
  let user = getUser();
  let userLoc = null;
  let userZoom = null;
  if (user) {
    const { loc, zoom } = user;
    userZoom = +zoom;
    userLoc = loc;
    if (userLoc === 'Current location') {
      userLoc = null;
      onPanToUserLoc();
      // setTimeout(onPanToUserLoc, 1)
    }
  }

  gMap = new google.maps.Map(document.querySelector('.map'), {
    zoom: userZoom || 16,
    center: userLoc || { lat: 29.55036, lng: 34.952278 },
  });

  gMap.addListener('click', (ev) => {
    console.log('ev', ev);
    const name = prompt('Place name?', 'Place 1');
    const lat = ev.latLng.lat();
    const lng = ev.latLng.lng();

    addPlace(name, lat, lng, gMap.getZoom());
    renderPlaces();
    renderMarkers();
  });

  renderMarkers();
}

function onPanToPlace(placeId) {
  const { lat, lng, zoom } = getPlaceById(placeId); // { lat:333, lng:33,zoom:10}
  saveSelectedPlace({ lat, lng });
  gMap.setCenter({ lat, lng });
  gMap.setZoom(zoom);
}

function onPanToUserLoc() {
  navigator.geolocation.getCurrentPosition(setCenterToUserLoc);
}

function setCenterToUserLoc({ coords }) {
  console.log('🚀 ~ file: place.controller.js:79 ~ setCenterToUserLoc ~ coords', coords);
  const { latitude: lat, longitude: lng } = coords;
  console.log('lat,lng', lat, lng);
  gMap.setCenter({ lat, lng });
}

function renderMarkers() {
  const places = getPlaces();
  // remove previous markers
  gMarkers.forEach((marker) => marker.setMap(null));
  // create a marker for every place
  gMarkers = places.map(({ lat, lng, name }) => {
    const coord = { lat, lng };
    return new google.maps.Marker({
      position: coord,
      map: gMap,
      title: name,
    });
  });
}

function renderUserPref() {
  const user = getUser();
  if (!user) return;
  const { bgColor, textColor } = user;
  const elBody = document.querySelector('body');
  elBody.style.backgroundColor = bgColor;
  elBody.style.color = textColor;
}

function onDownloadCSV(elLink) {
  const csvContent = getPlacesAsCSV();
  elLink.href = 'data:text/csv;charset=utf-8,' + csvContent;
}
