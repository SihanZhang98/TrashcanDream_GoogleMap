
const trashcanElement = document.querySelector("gmp-model-3d.trashcan");
const map = document.querySelector("gmp-map-3d.map");

// Initial position and altitude of the trashcan 40.726530408888934, -73.99408386965425
let trashcanLatitude = 40.726530408888934;
let trashcanLongitude =  -73.99408386965425;
let altitude = 1; 

// Movement settings
const acceleration = 0.0000001; 
const maxSpeed = 0.0005;     
const verticalAcceleration = 0.05; 
const maxVerticalSpeed = 0.08;      
const maxAltitude = 200;              
const friction = 0.98;              

// Velocity variables for each direction
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



//update the trashcan position
function updateTrashcanPosition() {
  trashcanLatitude += velocityLat;
  trashcanLongitude += velocityLng;
  altitude += velocityAlt;

  // Constrain altitude within maxAltitude to prevent flying too high
  altitude = Math.min(Math.max(altitude, 1), maxAltitude);

  // Update the element's position attribute
  trashcanElement.setAttribute(
    "position",
    `${trashcanLatitude},${trashcanLongitude},${altitude}`
  );

  // Update the map's center to follow the trashcan
map.setAttribute("center", `${trashcanLatitude},${trashcanLongitude},${altitude+12}`);

  //camera focus
// map.flyCameraTo({
//     endCamera: {
//       center: { lat: trashcanLatitude, lng: trashcanLongitude },
//       tilt: 67.5,
//       range: 10
//     },
//     durationMillis: 50
//   });
}

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


