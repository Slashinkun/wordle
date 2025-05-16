let wordList = []
let secretWord = ""
let maxGuesses = 6
let totalGuess = 0
let wordLength = 6
let currentRow = null;
let currentIndex = 0;
let score = 0

const alertUser =  document.getElementById("alert")
const userTries = document.getElementById("userTries")
const userInput = document.getElementById("userInput")
const board = document.getElementById("wordle-board");
const lengthSlider = document.getElementById("wordsLength")
const keyboard = document.getElementById("keyboard")
const userScore = document.getElementById('score')


function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
}

function initializeWordList(){
    fetch("mots.txt").then(response => response.text())
    .then(text => {
         wordList = text.split(/\r?\n/).filter(Boolean);
         wordList = wordList.map(word => removeAccents(word));
         wordList = wordList.filter((word) => word.length <= wordLength)
         startGame();
        })
        .catch(err => {
            console.error("Erreur pendant la recuperation de la liste de mot",err)
        })
    
}


function startGame(){
    board.innerHTML = "";
    keyboard.innerHTML = ""
    makeKeyboard()
    alertUser.innerHTML = "";
    userScore.innerText = `Score : ${score}`
    totalGuess = 0;
    currentRow = null;
    currentIndex = 0;
    const retryBtn = alertUser.querySelector("button");
    if (retryBtn) retryBtn.remove();
    document.getElementById("length").innerText = wordLength
    userTries.innerText = ` Tentatives : ${totalGuess}/${maxGuesses}`
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    addEmptyRows(secretWord.length, maxGuesses);
    
    console.log("Mot secret :", secretWord);
    

}


function addRetryButton(){
    let retryButton = document.createElement("button")
    retryButton.innerText='Recommencer'
    retryButton.addEventListener("click",()=>{
        startGame()
    })
    alertUser.appendChild(retryButton)
}


function checkWord(word){
    
    if (word === secretWord){
        handleCorrectGuess(word)
    }else if(wordList.find((w) => w === word)){
        handleIncorrectGuess(word)
    }else{
        showTemporaryAlert("Votre mot n'existe pas, veuillez reessayez")
    }

    if(totalGuess === maxGuesses){
        handleEndGame()
    }

    
}

function makeKeyboard(){
  let keys = "azertyuiopqsdfghjklmwxcvbn"
  const specialKeys = ["Backspace", "Enter"];
  for(let i = 0; i < keys.length;i++){
    let newKey = document.createElement("button")
    newKey.className = "key"
    newKey.id = `${keys.charAt(i)}-key`
    newKey.innerText = keys.charAt(i)
    newKey.addEventListener("click", (event) =>{
      const key = event.target.innerText;

     if (/^[a-z]$/.test(key) && currentIndex < secretWord.length) {
        currentRow.children[currentIndex].textContent = key;
        currentIndex++;
        updateActiveBox();
      }
    })
    keyboard.appendChild(newKey)
    
  }
  let backspaceKey = document.createElement("button");
  backspaceKey.className = "key special-key";
  backspaceKey.innerText = "⌫";   
  backspaceKey.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      currentRow.children[currentIndex].textContent = "";
      updateActiveBox();
    }
  });
  keyboard.appendChild(backspaceKey);

  let enterKey = document.createElement("button");
  enterKey.className = "key special-key";
  enterKey.innerText = "Entrée";
  enterKey.addEventListener("click", () => {
    if (currentIndex === secretWord.length) {
      let word = "";
      for (let i = 0; i < secretWord.length; i++) {
        word += currentRow.children[i].textContent;
      }
      checkWord(word);
    }
  });
  keyboard.appendChild(enterKey);

}

// function updateKeyboard(){
 
//   const keys = document.querySelectorAll(".key");

//   keys.forEach(key => {
//     key.classList.add("correct")
//   });

  
// }

function addEmptyRows(wordLength, numberOfRows) {
  console.log("on est dans addemptyrowS")
  for(let i = 0; i < numberOfRows; i++) {
    const row = document.createElement("div");
    row.classList.add(`word-row`);
    
    // if (i === 0) row.id = "empty-row";

    for(let j = 0; j < wordLength; j++) {
      const box = document.createElement("div");
      box.classList.add("letter-box");
      row.appendChild(box);
    }
    board.appendChild(row);

    if (i === 0) {
      currentRow = row;
      currentIndex = 0;
    }
  }
}


function showTemporaryAlert(message){
    alertUser.innerText = message
    setTimeout(() => {alertUser.innerText = ""},1000)
}


function handleCorrectGuess(word){

    const rows = board.children;
    console.log(rows)
    const emptyRow = currentRow;
  if (emptyRow) {
    const newRow = createWordRow(word, secretWord);
    console.log('On va replace child')
    board.replaceChild(newRow, emptyRow);
  }
  totalGuess++;
  userTries.innerText = ` Tentatives : ${totalGuess}/${maxGuesses}`;
  alertUser.innerText = "Bravo ! Tu as trouvé le mot";
  addRetryButton();
  score++;
  userScore.innerText = `Score : ${score}`
  currentRow = null
      
}

function handleIncorrectGuess(word){
    hideSettings()
    const rows = board.children;
    console.log(rows)
    const emptyRow = currentRow;
    if (emptyRow) {
        const newWordRow = createWordRow(word, secretWord);
        board.replaceChild(newWordRow, emptyRow);

        const index = Array.from(rows).indexOf(newWordRow);
        const next = board.children[index + 1];
        if (next) {
            currentRow = next;
        } else {
            currentRow = null;
        }

    }

     

    totalGuess++;
    currentIndex = 0;
    userTries.innerText = ` Tentatives : ${totalGuess}/${maxGuesses}`;
    updateActiveBox();
}

function hideSettings(){
    document.getElementById("settings").style.display = "none"
    lengthSlider.disabled = true
    document.getElementById("confirmLength").disabled = true
}

function handleEndGame(){
  console.log("On est a la fin")
  alertUser.innerHTML = `Dommage, le mot était <b>${secretWord}<b>`
  score = 0
  userScore.innerText = `Score : ${score}`
  addRetryButton()
  return;
}

function countLetters(word){
    let letters = {}

    for (let letter of word){
        if(letter in letters){
            letters[letter] += 1
        }else{
            letters[letter] = 1; 
        }
    }

    return letters
}



//ajoute au jeu le mot que le joueur a donné
function createWordRow(guess, secretWord) {
  console.log("on est dans createwordrow")
  const row = document.createElement("div");
  row.className = "word-row";

  const letterCounts = countLetters(secretWord);

  for (let i = 0; i < guess.length; i++) {
    const box = document.createElement("div");
    box.className = "letter-box";
    box.textContent = guess[i];

    if (guess[i] === secretWord[i]) {
      box.classList.add("correct");
      document.getElementById(`${guess.charAt(i)}-key`).classList.add("correct")
      letterCounts[guess[i]]--;
    }
    row.appendChild(box);
  }

  // Deuxième passage pour "almost"
  for (let i = 0; i < guess.length; i++) {
    const box = row.children[i];
    let key = document.getElementById(`${guess.charAt(i)}-key`)
    if (box.classList.contains("correct")) continue;

    if (secretWord.includes(guess[i]) && letterCounts[guess[i]] > 0) {
      box.classList.add("almost");
      

      if(!checkAlreadyMarked(key)){
        key.classList.add("almost")

      }
      letterCounts[guess[i]]--;
    } else {
        if(!checkAlreadyMarked(key)){
        key.classList.add("incorrect")
        }      
      box.classList.add("incorrect");
    }
  }

  return row;
}

function checkAlreadyMarked(key) {
  return key.classList.contains("correct") || key.classList.contains("almost");
}

// aide pour montrer la longueur du mot
function addEmptyWordRow(wordLength) {
  console.log("On est dans emptywordrow")
  const row = document.createElement("div");
  row.id = "empty-row"
  row.classList.add("word-row");

  for (let i = 0; i < wordLength; i++) {
    const box = document.createElement("div");
    box.classList.add("letter-box");
    //box.style.borderColor = "black"; 
    //box.style.opacity = "0.5"; 
    row.appendChild(box);
    
  }

  board.appendChild(row);
  currentRow = row;
  currentIndex = 0;
  updateActiveBox()
}



lengthSlider.addEventListener("change", (event) => {
    wordLength = event.target.value
    document.getElementById("length").innerText = event.target.value

})


document.getElementById("confirmLength").addEventListener("click", () => {
    board.innerHTML = ""
    initializeWordList()
})


function updateActiveBox() {
  if (!currentRow) return;
  for (let i = 0; i < currentRow.children.length; i++) {
    currentRow.children[i].classList.toggle("active", i === currentIndex);
  }
}

document.addEventListener("keydown", (event) => {
    if (!currentRow) return;

    const key = event.key.toLowerCase();

    if (/^[a-z]$/.test(key) && currentIndex < secretWord.length) {
        currentRow.children[currentIndex].textContent = key;
        currentIndex++;
        updateActiveBox();
    } else if (event.key === "Backspace" && currentIndex > 0) {
        currentIndex--;
        currentRow.children[currentIndex].textContent = "";
        updateActiveBox();
    } else if (event.key === "Enter" && currentIndex === secretWord.length) {
        let word = "";
        for (let i = 0; i < secretWord.length; i++) {
            word += currentRow.children[i].textContent;
        }
        checkWord(word);
    }
});





initializeWordList()
updateActiveBox();




