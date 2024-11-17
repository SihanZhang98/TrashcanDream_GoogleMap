
const trashcan = document.querySelector("gmp-model-3d.trashcan");
const map = document.querySelector("gmp-map-3d.map");
const dirline = document.querySelector('gmp-polyline-3d');


// Initial position 40.68958157491507,-73.99165410966313
let trashcanLat = 40.69091634261124;
let trashcanLng = -73.99167008808041;
let trashcanAlt = 18; 

//locations 
const parkLat =40.66138759157992;
const parkLng = -73.96835675819345;
const govIslandLat =40.687050510645996;
const govIslandLng =-74.02040954812702;
const coneyIslandLat = 40.57254213065525;
const coneyIslandLng = -73.97870758505385;
const stationLat =40.67176559632283;
const  stationLng =-73.99715614721433;

// Movement settings
const acceleration = 0.0000002; 
const maxSpeed = 0.0008;     
const verticalAcceleration = 0.09; 
const maxVerticalSpeed = 0.12;      
const maxAltitude = 150;              
const friction = 0.98;  
const distThreshold = 0.00008;            

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

//ui
const ui = document.querySelector(".dialogue-container");
const uiText = document.querySelector(".dialogue-text");
const nextButton = document.querySelector(".next-button");

let currentLineIndex = 0;
let currentQuizIndex = 0;
let uiVisible = false;


const textLines = [
  "Welcome to this location!",
  "Here's some interesting information.",
  "You can do amazing things here.",
  "Enjoy your adventure!"
];

const quizzes = [
  {
    question: "Which one can be turned into compost?",
    options: [
      { image: "https://placehold.co/600x400", isCorrect: true },
      { image: "https://placehold.co/600x400", isCorrect: false },
    ],
  },
  {
    question: "Which material is recyclable?",
    options: [
      { image: "https://placehold.co/600x400", isCorrect: true },
      { image: "https://placehold.co/600x400", isCorrect: false },
    ],
  },
  {
    question: "Which item is biodegradable?",
    options: [
      { image: "https://placehold.co/600x400", isCorrect: true },
      { image: "https://placehold.co/600x400", isCorrect: false },
    ],
  },
];

function loadQuiz(quizIndex) {
  const quizContainer = document.querySelector(".quiz-container");
  quizContainer.style.display = "block";

  const quiz = quizzes[quizIndex];

  // Update question text
  document.querySelector(".quiz-question").textContent = quiz.question;

  // Update options dynamically
  const option1 = document.querySelector(".option-1");
  const option2 = document.querySelector(".option-2");
  
  // Set image sources and event handlers
  option1.src = quiz.options[0].image;
  option1.onclick = () => checkAnswer(quiz.options[0].isCorrect);

  option2.src = quiz.options[1].image;
  option2.onclick = () => checkAnswer(quiz.options[1].isCorrect);
}

function checkAnswer(isCorrect) {
  const feedback = document.querySelector(".feedback");
  if (isCorrect) {
    feedback.textContent = "Correct!";
    feedback.style.color = "green";

    // Load next quiz after a delay
    setTimeout(() => {
      currentQuizIndex++;
      if (currentQuizIndex < quizzes.length) {
        loadQuiz(currentQuizIndex);
      } else {
        feedback.textContent = "You've completed all the quizzes!";
      }
    }, 1000);
  } else {
    feedback.textContent = "Try again!";
    feedback.style.color = "red";
  }
}

function showNextLine() {
  console.log("Next button clicked");
  currentLineIndex++;
  if (currentLineIndex < textLines.length) {
    uiText.textContent = textLines[currentLineIndex];
  } else {

    ui.style.display = "none";
    currentLineIndex = 0; 
    loadQuiz(currentQuizIndex);
  }
}
nextButton.addEventListener("click", showNextLine);



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

// Calculate distance using simple approximation
function isNearLocation(lat1, lng1, lat2, lng2, threshold) {
  const latDiff = Math.abs(lat1 - lat2);
  const lngDiff = Math.abs(lng1 - lng2);
  return latDiff <= threshold && lngDiff <= threshold;
}

// check proximity and show UI
function checkDistanceAndShowUI() {

  if (isNearLocation(trashcanLat, trashcanLng, stationLat, stationLng, distThreshold)) {
    if (!uiVisible) {
    uiVisible = true;
    ui.style.display = "block";
    uiText.textContent = textLines[0];
    currentLineIndex = 0;
    }
  }
}

function applyMovement() {
  if (!uiVisible) {
  const heading = parseFloat(map.getAttribute("heading")) || 0; // Map's heading in degrees

  // Convert heading to radians for calculations
  const headingRad = (heading * Math.PI) / 180;

  // Movement vector based on keys and map's heading
  let moveForwardLat = Math.cos(headingRad) * acceleration;
  let moveForwardLng = Math.sin(headingRad) * acceleration;

  let moveSidewaysLat = Math.sin(headingRad) * acceleration;
  let moveSidewaysLng = -Math.cos(headingRad) * acceleration;

  // Apply acceleration for movement
  if (keys.w) {
    velocityLat = Math.min(velocityLat + moveForwardLat, maxSpeed);
    velocityLng = Math.min(velocityLng + moveForwardLng, maxSpeed);
  }
  if (keys.s) {
    velocityLat = Math.max(velocityLat - moveForwardLat, -maxSpeed);
    velocityLng = Math.max(velocityLng - moveForwardLng, -maxSpeed);
  }
  if (keys.a) {
    velocityLat = Math.min(velocityLat + moveSidewaysLat, maxSpeed);
    velocityLng = Math.min(velocityLng + moveSidewaysLng, maxSpeed);
  }
  if (keys.d) {
    velocityLat = Math.max(velocityLat - moveSidewaysLat, -maxSpeed);
    velocityLng = Math.max(velocityLng - moveSidewaysLng, -maxSpeed);
  }
  if (keys.space) {
    velocityAlt = Math.min(velocityAlt + verticalAcceleration, maxVerticalSpeed);
  }
  // Apply friction to movement
  velocityAlt *= friction;
  velocityLat *= friction;
  velocityLng *= friction;

  // Update position and request the next animation frame
  updateTrashcanPosition();
}
  checkDistanceAndShowUI();
  requestAnimationFrame(applyMovement);
}

// Start the animation loop
applyMovement();

// Listen for keydown and keyup events to track which keys are pressed
document.addEventListener("keydown", (event) => {
  if (!uiVisible) { // Ignore key events when UI is visible
    if (event.key === " ") {
      event.preventDefault(); // Prevent page scrolling with spacebar
      keys.space = true;
    }
    if (event.key in keys) keys[event.key] = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (!uiVisible) { // Ignore key events when UI is visible
    if (event.key === " ") keys.space = false;
    if (event.key in keys) keys[event.key] = false;
  }
});


