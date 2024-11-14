

// Initial position and altitude of the trashcan
let trashcanLatitude = 40.726779;
let trashcanLongitude = -73.99404;
let altitude = 1; 

// Movement settings
const acceleration = 0.0000001; 
const maxSpeed = 0.0005;     
const verticalAcceleration = 0.05; 
const maxVerticalSpeed = 0.08;      
const maxAltitude = 100;              
const friction = 0.95;              

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

// Get the trashcan element
const trashcanElement = document.querySelector("gmp-model-3d.trashcan");

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
}

// handle movement with acceleration
function applyMovement() {
  // Apply acceleration for horizontal movement if keys are pressed
  if (keys.w) velocityLat = Math.min(velocityLat + acceleration, maxSpeed);
  if (keys.s) velocityLat = Math.max(velocityLat - acceleration, -maxSpeed);
  if (keys.a) velocityLng = Math.max(velocityLng - acceleration, -maxSpeed);
  if (keys.d) velocityLng = Math.min(velocityLng + acceleration, maxSpeed);
  if (keys.space) velocityAlt = Math.min(velocityAlt + verticalAcceleration, maxVerticalSpeed);



  // Apply friction to horizontal movement
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
