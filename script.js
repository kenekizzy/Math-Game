// Pages
const gamePage = document.querySelector("#game-page")
const scorePage = document.querySelector('#score-page');
const splashPage = document.querySelector('#splash-page');
const countdownPage = document.querySelector('#countdown-page');
// Splash Page
const startForm = document.querySelector('#start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let radioInput = 0
let equationsArray = [];
let playerGuess = []
let bestScoreArray = []

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Scroll
let valueY = 0

// Time
let timer
let timePlayed = 0
let baseTime = 0
let penaltyTime = 0
let finalTime = 0
let finalTimeDisplay = "0.0"

//function to get the question value
function getQuestionValue(e){
  e.preventDefault()
  radioInput = getRadioValue()
  console.log(radioInput)
  if(radioInput){
    showCountdown()
  }
}

//Function to get radio Input value
function getRadioValue(){
  let radioValue
    radioInputs.forEach((radioInput) => {
      if(radioInput.checked){
        radioValue = radioInput.value
      }  
    })
    return radioValue
}

//Function to swap to the countdown page
function showCountdown(){
  splashPage.hidden = true
  countdownPage.hidden = false
  startCount()
  setTimeout(showGamePage, 4000)
  populateGamePage()
}

//Countdown function for the webpage
function startCount(){
  countdown.textContent = `3`
  setTimeout(() =>{
   countdown.textContent = `2`
  }, 1000)
  setTimeout(() =>{
   countdown.textContent = `1`
  }, 2000)
  setTimeout(() =>{
   countdown.textContent = `Go`
  }, 3000)
 }

 //Function to swap the gamePage
function showGamePage(){
  gamePage.hidden = false
  countdownPage.hidden = true
}

//Creating a get random number function for getting random number of equations
function getRandomValue(value){
  return Math.floor(Math.random() * Math.floor(value))
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
   const correctEquations = getRandomValue(radioInput)
   console.log("Correct:", correctEquations)
  // Set amount of wrong equations
   const wrongEquations = radioInput - correctEquations
   console.log("Wrong", wrongEquations)
  // Loop through, multiply random numbers up to 9, push to array
     for (let i = 0; i < correctEquations; i++) {
       firstNumber = getRandomValue(10)
       secondNumber = getRandomValue(10)
       const equationValue = firstNumber * secondNumber;
       const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
       equationObject = { value: equation, evaluated: 'true' };
       equationsArray.push(equationObject);
     }
  // Loop through, mess with the equation results, push to array
    for (let i = 0; i < wrongEquations; i++) {
      firstNumber = getRandomValue(20)
      secondNumber = getRandomValue(20)
      const equationValue = firstNumber * secondNumber;
      wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
      wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
      wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
      const formatChoice = getRandomValue(3)
      const equation = wrongFormat[formatChoice];
      equationObject = { value: equation, evaluated: 'false' };
      equationsArray.push(equationObject);
    }
    shuffle(equationsArray)
}

//Adding our Equations to the Page
function equationsToPage(){
  equationsArray.forEach((equation) => {
    // creating the html div element
    const item = document.createElement("div")
    item.classList.add("item")
    // creating the h1 element
    const header = document.createElement("h1")
    header.textContent = equation.value
    //Appending the two elements
    item.appendChild(header)
    itemContainer.appendChild(item)
  })
}
 //Dynamically adding correct/incorrect equations
 function populateGamePage() {
   // Reset DOM, Set Blank Space Above
   itemContainer.textContent = '';
    //Spacer
   const topSpacer = document.createElement('div');
   topSpacer.classList.add('height-240');
    //Selected Item
   const selectedItem = document.createElement('div');
   selectedItem.classList.add('selected-item');
    //Append
   itemContainer.append(topSpacer, selectedItem);

    //Create Equations, Build Elements in DOM
    createEquations()
    equationsToPage()

    //Set Blank Space Below
   const bottomSpacer = document.createElement('div');
   bottomSpacer.classList.add('height-500');
   itemContainer.appendChild(bottomSpacer);
 }

 //Scrolling and storing the players geusses
 function select(guess){
   valueY += 80
   itemContainer.scroll(0, valueY)
   return guess? playerGuess.push("true"): playerGuess.push("false")
 }
 //function to show score page
 function showScorePage(){
   setTimeout(() => {
     playAgainBtn.hidden = false
   }, 2000);
  gamePage.hidden = true
  scorePage.hidden = false
 }
//function to add the scores to the scorePage
 function scoresToPage(){
  finalTimeDisplay = finalTime.toFixed(1)
  finalTimeEl.textContent = `${finalTime.toFixed(1)}s`
  baseTimeEl.textContent = `Base Time: ${timePlayed.toFixed(1)}s`
  penaltyTimeEl.textContent = `Penalty Time: ${penaltyTime.toFixed(1)}s`
  //scroll to the top
  updateBestScore()
  itemContainer.scrollTo({top: 0, behavior: "instant"})
  showScorePage()
 }
 //function to store time when the game is ended
function checkTime(){
  console.log(timePlayed)
  if(playerGuess.length == radioInput){
    console.log(playerGuess[3])
    console.log(equationsArray[3].evaluated)
    clearInterval(timer);
    for(let i = 0; i < radioInput; i++){
      if(playerGuess[i] != equationsArray[i].evaluated){
        penaltyTime += 1.0
      }
    }
    finalTime = timePlayed + penaltyTime
    scoresToPage()
  }
  }
 
 //function to add time to the time played
 function addTime(){
   timePlayed += 0.1
   checkTime()
 }
 //Function to start the timer when the game button is clicked
 function startTimer(){
   //Resetting all the previous times
   timePlayed = 0
   penaltyTime = 0
   finalTime = 0
   timer = setInterval(addTime, 100);
   gamePage.removeEventListener("click", startTimer)
 }

 //Function to restart the game again
 function startGameAgain(){
  gamePage.addEventListener("click", startTimer)
  scorePage.hidden = true
  splashPage.hidden = false
    radioInput = 0
    equationsArray = [];
    playerGuess = []
    valueY = 0
    playAgainBtn.hidden = true
 }
 //Getting the best scores from the local storage
 function getBestScores(){
  if(localStorage.getItem("bestScores")){
    bestScoreArray = JSON.parse(localStorage.bestScores)
  }else{
    bestScoreArray = [
      {question: 10, scores: finalTimeDisplay},
      {question: 25, scores: finalTimeDisplay},
      {question: 50, scores: finalTimeDisplay},
      {question: 99, scores: finalTimeDisplay},
    ]
    localStorage.setItem("bestScores", JSON.stringify(bestScoreArray))
  }
  bestScoresToPage()
 }
//Populating the page with the values dynamically
function bestScoresToPage(){
    for(let i = 0; i < bestScoreArray.length; i++){
      bestScores[i].textContent = `${bestScoreArray[i].scores}s`
    }
}
//Updating the best scores on the page
function updateBestScore(){
  for(let i = 0; i < bestScoreArray.length; i++){
    if(radioInput == bestScoreArray[i].question){
      //Saving the Best Scores
      const savedBestScores = Number(bestScoreArray[i].scores)
      //comparing and updating the best score function
      console.log(savedBestScores)
      if(savedBestScores === 0 || savedBestScores > finalTime){
        bestScoreArray[i].scores = finalTimeDisplay
      }
    }
  }
  //Updating the Scores on the Page
  bestScoresToPage()
  //Updating the Local Storage
  localStorage.setItem("bestScores", JSON.stringify(bestScoreArray))
}
//Adding Event Listeners
startForm.addEventListener("click", () =>{
  radioContainers.forEach((radioEl) => {
    radioEl.classList.remove("selected-label")
    //Checking if a radio button was clicked
    if(radioEl.children[1].checked){
      radioEl.classList.add("selected-label")
    }
  })
})
startForm.addEventListener("submit", getQuestionValue)
gamePage.addEventListener("click", startTimer)
playAgainBtn.addEventListener("click", startGameAgain)
//On Load
getBestScores()