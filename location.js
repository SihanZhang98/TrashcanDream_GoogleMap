const park =  document.querySelector('gmp-polygon-3d.prospect-park');
const height = 80;
customElements.whenDefined(park.localName).then(() => {
  park.outerCoordinates = [
    {lat: 40.672, lng: -73.971,altitude: height},
    {lat: 40.661, lng: -73.980,altitude: height},
    {lat: 40.658, lng: -73.974,altitude: height},
    {lat: 40.651, lng: -73.971,altitude: height},
    {lat: 40.654, lng: -73.961,altitude: height},
    {lat: 40.662, lng: -73.963,altitude: height},
    {lat: 40.665, lng: -73.961,altitude: height},
    {lat: 40.671, lng: -73.961,altitude: height}
  ];
});

//polyline showing direction 
customElements.whenDefined(dirline.localName).then(() => {
  dirline.coordinates = [
    {lat:  trashcanLat, lng:  trashcanLng, altitude:  maxAltitude-5},
    {lat:  stationLat, lng: stationLng, altitude:  maxAltitude-5},
        ];
});