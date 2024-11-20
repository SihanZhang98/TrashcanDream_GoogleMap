const garden =  document.querySelector('gmp-polygon-3d.q-garden');
const station =  document.querySelector('gmp-polygon-3d.transfer-station');
const stationMarker=document.querySelector('gmp-marker-3d.transfer-station-marker');
const height = 40;

//polyline showing direction 
customElements.whenDefined(dirline.localName).then(() => {
  dirline.coordinates = [
    {lat:  trashcanLat, lng:  trashcanLng, altitude:  maxAltitude-40},
    {lat:  stationLat, lng:stationLng, altitude:  maxAltitude-40},
        ];
});

//station polygon
customElements.whenDefined(station.localName).then(() => {
  station.outerCoordinates = [//40.66942850011637, -73.9983230558564
    {lat:40.66888222006535, lng: -73.99721646360402,altitude: height},
    {lat: 40.668375646480186, lng: -73.9976241593583,altitude: height},
    {lat: 40.66892383400076, lng: -73.99875835960883,altitude: height},
    {lat: 40.66942850011637, lng: -73.9983230558564,altitude: height},
  ];
});

//park polygon
// customElements.whenDefined(garden.localName).then(() => {
//   garden.outerCoordinates = [
//     {lat: 40.649678604978405, lng: -73.96337377353251,altitude: height},
//     {lat: 40.649942134291585, lng: -73.96328468286639,altitude: height},
//     {lat: 40.64965208086651, lng: -73.96323393501861,altitude: height},
//   ];
// });





