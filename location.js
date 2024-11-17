const park =  document.querySelector('gmp-polygon-3d.prospect-park');
const station =  document.querySelector('gmp-polygon-3d.prospect-park');
const stationMarker=document.querySelector('gmp-marker-3d.transfer-station-marker');
const height = 40;

//polyline showing direction 
customElements.whenDefined(dirline.localName).then(() => {
  dirline.coordinates = [
    {lat:  trashcanLat, lng:  trashcanLng, altitude:  maxAltitude-5},
    {lat:  stationLat, lng: stationLng, altitude:  maxAltitude-5},
        ];
});

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

customElements.whenDefined(station.localName).then(() => {
  station.outerCoordinates = [//40.66942850011637, -73.9983230558564
    {lat:40.66888222006535, lng: -73.99721646360402,altitude: height},
    {lat: 40.668375646480186, lng: -73.9976241593583,altitude: height},
    {lat: 40.66892383400076, lng: -73.99875835960883,altitude: height},
    {lat: 40.66942850011637, lng: -73.9983230558564,altitude: height},
  ];
});



