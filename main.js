
const trashcan = document.querySelector("gmp-model-3d.trashcan");
const map = document.querySelector("gmp-map-3d.map");
const dirline = document.querySelector('gmp-polyline-3d');

// Initial position 
let trashcanLat = 40.72735799241893;
let trashcanLng = -73.99346551732907;
let trashcanAlt = 15; 

//desitination 
const coneyIslandLat = 40.5755;
const coneyIslandLng = -73.9893;

// Movement settings
const acceleration = 0.0000002; 
const maxSpeed = 0.0008;     
const verticalAcceleration = 0.05; 
const maxVerticalSpeed = 0.08;      
const maxAltitude = 150;              
const friction = 0.98;              

// Velocity for each direction
let velocityLat = 0;
let velocityLng = 0;
let velocityAlt = 0; 

// Track which keys are pressed
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false,
};

//polyline showing direction 
customElements.whenDefined(dirline.localName).then(() => {
  dirline.coordinates = [
    {lat:  trashcanLat, lng:  trashcanLng, altitude:  maxAltitude-5},
    {lat:  coneyIslandLat, lng: coneyIslandLng, altitude:  maxAltitude-5},
        ];
});

//update the trashcan position
function updateTrashcanPosition() {
  trashcanLat += velocityLat;
  trashcanLng += velocityLng;
  trashcanAlt += velocityAlt;

  // Constrain altitude within maxAltitude to prevent flying too high
  trashcanAlt = Math.min(Math.max(trashcanAlt, 1), maxAltitude);

  // Update the element's position attribute
  trashcan.setAttribute(
    "position",
    `${trashcanLat},${trashcanLng},${trashcanAlt}`
  );

  // Update the map's center to follow the trashcan
map.setAttribute("center", `${trashcanLat},${trashcanLng},${trashcanAlt}`);

}

// function updateDirLine(){
//   const coordinates = [
//     { lat: trashcanLat, lng: trashcanLng,altitude: trashcanAlt},
//     { lat: coneyIslandLat, lng: coneyIslandLng,altitude: trashcanAlt},
//   ];

//   // Ensure the custom element is defined before updating
//   customElements.whenDefined(dirline.localName).then(() => {
//     dirline.coordinates = coordinates;
//   });
// }

// handle movement with acceleration
function applyMovement() {
  // Apply acceleration for horizontal movement if keys are pressed
  if (keys.s) velocityLat = Math.min(velocityLat + acceleration, maxSpeed);
  if (keys.w) velocityLat = Math.max(velocityLat - acceleration, -maxSpeed);
  if (keys.d) velocityLng = Math.max(velocityLng - acceleration, -maxSpeed);
  if (keys.a) velocityLng = Math.min(velocityLng + acceleration, maxSpeed);
  if (keys.space) velocityAlt = Math.min(velocityAlt + verticalAcceleration, maxVerticalSpeed);

  // Apply friction to movement
  velocityAlt *= friction;
  velocityLat *= friction;
  velocityLng *= friction;

  // Update position and request the next animation frame
  updateTrashcanPosition();
  // updateDirLine();
  requestAnimationFrame(applyMovement);
}

// Start the animation loop
applyMovement();

// Listen for keydown and keyup events to track which keys are pressed
document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault(); // Prevent page scrolling with spacebar
    keys.space = true;
  }
  if (event.key in keys) keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  if (event.key === " ") keys.space = false;
  if (event.key in keys) keys[event.key] = false;
});


