
const trashcan = document.querySelector("gmp-model-3d.trashcan");
const map = document.querySelector("gmp-map-3d.map");
const dirline = document.querySelector('.direction-line');



// Initial position 40.68958157491507,-73.99165410966313
let trashcanLat = 40.69091634261124;
let trashcanLng = -73.99167008808041;
let trashcanAlt = 18; 

//locations 
const stationLat =40.67176559632283;
const stationLng =-73.99715614721433;
const ratLat =40.64244484417126;
const ratLng = -73.99462613238627;
const coneyIslandLat = 40.57254213065525;
const coneyIslandLng = -73.97870758505385;
let currentLocationIndex =0;

// Movement settings
const acceleration = 0.0000002; 
const maxSpeed = 0.0008;     
const verticalAcceleration = 0.09; 
const maxVerticalSpeed = 0.12;      
const maxAltitude = 150;              
const friction = 0.98;  
const distThreshold = 0.00005;            

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
const continueText = document.querySelector(".continue");
const quizContainer = document.querySelector(".quiz-container");
const rightImg="assets/right.png";
const wrongImg="assets/wrong.png";

//intro video UI
const introContainer=document.querySelector(".intro-container");
const introVideo=document.querySelector(".intro-video");
const endingContainer=document.querySelector(".ending-container");
const endingVideo=document.querySelector(".ending-video");
const unmuteButton=document.querySelector(".unmute-button");
const skipButton=document.querySelector(".skip-button");
const againButton=document.querySelector(".play-again-button");
let gamePlaying =false;

let currentLineIndex = 0;
let currentQuizIndex = 0;
let uiVisible = false;


const locations =[//40.64244816956603, -73.99461955863221
  { id:"station" , lat: 40.67176559632283, lng:-73.99715614721433},
  {id:"compost-site", lat:40.6222508393462,  lng:-73.97681710500046},
  {id:"coneyisland",lat:40.57475983566617, lng:-73.98593802882345}
]

const dialogues=[
  ["Ugh, what’s that smell？",
  "Oh that's the Hamilton Avenue Marine Transfer Station!",
  "Trash from all over Brooklyn is collected there before being sent to landfills.",
  "There’s just so much trash piling up—the smell is unbearable!",
  "If only people could reduce waste and recycle more, it wouldn’t be this bad…"],

  ["Ah what a disaster! ",
    "The rat is messing with the compost bin！",
    "All kinds of trash are mixed up now...",
    "I can't just stand by and let this happen.",
    "Composting reduces waste, improves the soil, and helps the environment.",
    "I need to fix this mess."],

  ["It's Coney Island! I made it!",
    "Wait...this is the beach I’ve been dreaming of?",
    "Why is it covered in so much trash?",
    "I've came a long way, trying to find a trash-free place..",
    "but this is the reality..."
  ],
]

const quizzes = [
  //location1 quizzes
  [
    {
      question: "Do you know how much trash does the average New Yorker produce per day?",
      options: [
        { image: "assets/5pound.png", isCorrect: true },
        { image: "assets/3pound.png", isCorrect: false },
      ],
    },
    {
      question: "What percentage of New York's trash ends up in landfills?",
      options: [
        { image: "assets/80.png", isCorrect: true },
        { image: "assets/60.png", isCorrect: false },
      ],
    },
    {
      question: "What is the primary greenhouse gas produced by landfills?",
      options: [
        { image: "assets/CO2.png", isCorrect: false },
        { image: "assets/Methane.png", isCorrect: true },
      ],
    },
    {
      question: "How can New Yorkers reduce the amount of trash they generate?",
      options: [
        { image: "assets/mix.png", isCorrect: false },
        { image: "assets/compost.png", isCorrect: true },
      ],
    },
  ],

     //location2 quizzes
  [
    {
      question: "Which one should go into the compost bin?",
      options: [
        { image: "assets/veggie.png", isCorrect: true },
        { image: "assets/chicken-bone.png", isCorrect: false },
      ],
    },
    {
      question: "Which one cannot go into the compost bin?",
      options: [
        { image: "assets/leaf.png", isCorrect: false },
        { image: "assets/meat.png", isCorrect: true },
      ],
    },
    {
      question: "What helps the composting process go more smoothly?",
      options: [
        { image: "assets/cheese.png", isCorrect: false },
        { image: "assets/coffee.png", isCorrect: true },
      ],
    },
    {
      question: "Which is the 'enermy' that dirty the compost?",
      options: [
        { image: "assets/apple.png", isCorrect: false },
        { image: "assets/plastic.png", isCorrect: true },
      ],

    }
  ],

  [
    {
      question: "Should I stay here or go back?",
      options: [
        { image: "assets/stay.png", video:"assets/google_ending_stay.mp4"},
        { image: "assets/return.png",video:"assets/google_ending_stay.mp4"},
      ],
    }
  ],


];

//intro video
unmuteButton.addEventListener('click', () => {
  introVideo.muted = false;
  unmuteButton.style.display = 'none';
});

skipButton.addEventListener('click', () => {
  introContainer.style.display = 'none';
  //gameContainer.style.display = 'block';
  introVideo.pause();
  gamePlaying=true;
});

introVideo.addEventListener('ended', () => {
  introContainer.style.display = 'none';
  gamePlaying=true;
});

endingVideo.addEventListener('ended', () => {
  againButton.style.display = 'block';

})

againButton.addEventListener('ended', () => {
  endingContainer.style.display="none";
  introContainer.style.display="block";

});

function loadQuiz(quizIndex) {

  quizContainer.style.display = "block";

  //get currrent quiz
  let quiz = quizzes[currentLocationIndex][currentQuizIndex];
  console.log(currentLocationIndex);
  console.log(currentQuizIndex);
  console.log(quiz);

  // Update question text
  uiText.textContent = quiz.question;

  //uodate option images
  const option1 = document.querySelector(".option-1");
  const option2 = document.querySelector(".option-2");
  option1.src = quiz.options[0].image;
  option2.src = quiz.options[1].image;

  if(currentLocationIndex==locations.length-1){
  //if final location
  option1.onclick = () => loadEnding(quiz.options[0].video);
  option2.onclick = () => loadEnding(quiz.options[1].video);
  }else{
      //if not final location
    option1.onclick = () => checkAnswer(0,quiz.options[0].isCorrect);
    option2.onclick = () => checkAnswer(1, quiz.options[1].isCorrect);
  }

}

function loadEnding(videoSrc){
  gamePlaying=false;
  endingContainer.style.display="block";
  endingVideo.src=videoSrc;

  //reset 
  currentLineIndex = 0;
  currentQuizIndex = 0;
  currentLocationIndex=0;
  trashcanLat = 40.69091634261124;
  trashcanLng = -73.99167008808041;
  trashcanAlt = 18; 
  quizContainer.style.display = "none";
  ui.style.display = "none";
  uiVisible =false; 

  dirline.coordinates = [
    {lat:  trashcanLat, lng:  trashcanLng, altitude:  maxAltitude-5},
    {lat:  locations[currentLocationIndex].lat, lng:locations[currentLocationIndex].lng, altitude:  maxAltitude-5},
        ];
}

function checkAnswer(selectedOption, isCorrect) {
  const answer1 = document.querySelector(".answer-1");
  const answer2 = document.querySelector(".answer-2");
  if (isCorrect) {
    console.log('correct');
    if(selectedOption==0){
      answer1.src= rightImg;
      answer1.style.visibility = "visible";
    }else{
      answer2.src= rightImg;
      answer2.style.visibility = "visible";
    }}else{
      console.log('incorrect');
      if(selectedOption==0){
        answer1.src= wrongImg;
        answer1.style.visibility = "visible";
    }else{
      answer2.src= wrongImg;
      answer2.style.visibility = "visible";
    }}

    // Load next quiz after a delay
    setTimeout(() => {
      currentQuizIndex++;
      answer1.style.visibility="hidden";
      answer2.style.visibility="hidden";
      if (currentQuizIndex < quizzes[currentLocationIndex].length) {
        loadQuiz(currentQuizIndex);
      } else {
        currentLocationIndex++;
        currentQuizIndex=0;
        //hide ui
        quizContainer.style.display = "none";
        uiText.textContent ="Let's keep moving to the next location!"
        ui.style.display = "none";
        uiVisible =false; 

        dirline.coordinates = [
          {lat:  trashcanLat, lng:  trashcanLng, altitude:  maxAltitude-5},
          {lat:  locations[currentLocationIndex].lat, lng:locations[currentLocationIndex].lng, altitude:  maxAltitude-5},
              ];

      }
    }, 500);

}

function showNextLine() {
  //current location's dialogue
  let dialogue=dialogues[currentLocationIndex];

  currentLineIndex++;
  if (currentLineIndex < dialogue.length) {
    uiText.textContent = dialogue[currentLineIndex];
  } else {
    currentLineIndex = 0; 
    continueText.style.visibility="hidden";
    nextButton.style.visibility="hidden";
    loadQuiz(currentQuizIndex);
  }
}
nextButton.addEventListener("click", showNextLine);



//update the trashcan position
function updateTrashcanPosition() {
  trashcanLat += velocityLat;
  trashcanLng += velocityLng;
  trashcanAlt += velocityAlt;
  trashcanAlt = Math.min(Math.max(trashcanAlt, 1), maxAltitude);

  trashcan.setAttribute(
    "position",
    `${trashcanLat},${trashcanLng},${trashcanAlt}`
  );

  // Update the map's center to follow the trashcan
 map.setAttribute("center", `${trashcanLat},${trashcanLng},${trashcanAlt}`);

}


// check proximity and show UI
function checkDistanceAndShowUI(targetLat,targetLng) {

  let latDiff = Math.abs(trashcanLat - targetLat);
  let lngDiff = Math.abs(trashcanLng - targetLng);
  if (latDiff <= distThreshold || lngDiff <= distThreshold) {
    //hide dirline
    dirline.coordinates = [
      {lat:  trashcanLat, lng:  trashcanLng, altitude:  -5},
      {lat:  locations[currentLocationIndex].lat, lng:locations[currentLocationIndex].lng, altitude:  -5},
          ];
    //stop trashcan
    velocityLat = 0;
    velocityLng = 0;
    velocityAlt = 0;
    //display ui
    uiVisible = true;
    ui.style.display = "block";
    nextButton.style.visibility="visible";
    continueText.style.vibility="visible";
    uiText.textContent = dialogues[currentLocationIndex][0];
    currentLineIndex = 0;
  }
}

function applyMovement() {
  if (gamePlaying&&!uiVisible) {
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

//update trashcan position
  updateTrashcanPosition();

  //check distance to target location
  let targetLocation = locations[currentLocationIndex];
  checkDistanceAndShowUI(targetLocation.lat,targetLocation.lng);

}
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
  }
);

document.addEventListener("keyup", (event) => {
    if (event.key === " ") keys.space = false;
    if (event.key in keys) keys[event.key] = false;
});


