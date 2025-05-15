let wordList = []
let secretWord = ""
let maxGuesses = 6
let totalGuess = 0

//a faire  : slider pour choisir la longueur du mot
let wordLength = 6

const alertUser =  document.getElementById("alert")
const userTries = document.getElementById("userTries")
const userInput = document.getElementById("userInput")
const userGuess = document.getElementById("userGuess")

const board = document.getElementById("wordle-board");

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
    
    userTries.innerText = ` Tentatives : ${totalGuess}/${maxGuesses}`
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    addEmptyWordRow(secretWord.length)
    userInput.maxLength = secretWord.length
    userInput.placeholder = `${secretWord.length} lettres`
    //console.log("Mot secret :", secretWord);
    //console.log(countLetters(secretWord))

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

function showTemporaryAlert(message){
    alertUser.innerText = message
    setTimeout(() => {alertUser.innerText = ""},1000)
}

function handleCorrectGuess(word){
        userInput.disabled = true
        totalGuess++;
        addWordRow(word,secretWord)
        userTries.innerText = ` Tentatives : ${totalGuess}/${maxGuesses}`
        alertUser.innerText = "Bravo ! Tu as trouvé le mot"
        let retryButton = document.createElement("button")
        retryButton.innerText='Recommencer'
        retryButton.addEventListener("click",()=>{
            location.reload()
        })
        alertUser.appendChild(retryButton)  
}

function handleIncorrectGuess(word){
    board.removeChild(document.getElementById("empty-row"))
        //console.log(wordList.find((w) => w === word))
        addWordRow(word,secretWord)
        addEmptyWordRow(secretWord.length)
        totalGuess++;
}

function handleEndGame(){
    board.removeChild(document.getElementById("empty-row")) 
        alertUser.innerHTML = `Dommage, le mot était <b>${secretWord}<b>`
        userInput.disabled = true
        let retryButton = document.createElement("button")
        retryButton.innerText='Recommencer'
        retryButton.addEventListener("click",()=>{
            location.reload()
        })
        alertUser.appendChild(retryButton)
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


function addWordRow(guess, secretWord) {
  
  const row = document.createElement("div");
  row.className = "word-row";

  const letterCounts = countLetters(secretWord);

  for (let i = 0; i < guess.length; i++) {
    const box = document.createElement("div");
    box.className = "letter-box";
    box.textContent = guess[i];

    if (guess[i] === secretWord[i]) {
      box.classList.add("correct");
      letterCounts[guess[i]]--;
    }
    row.appendChild(box);
  }

  // Deuxième passage pour "almost"
  for (let i = 0; i < guess.length; i++) {
    const box = row.children[i];
    if (box.classList.contains("correct")) continue;

    if (secretWord.includes(guess[i]) && letterCounts[guess[i]] > 0) {
      box.classList.add("almost");
      letterCounts[guess[i]]--;
    } else {
      box.classList.add("incorrect");
    }
  }

  board.appendChild(row);
}

function addEmptyWordRow(wordLength) {
  
  const row = document.createElement("div");
  row.id = "empty-row"
  row.classList.add("word-row");

  for (let i = 0; i < wordLength; i++) {
    const box = document.createElement("div");
    box.classList.add("letter-box");
    box.style.borderColor = "black"; 
    box.style.opacity = "0.5"; 
    row.appendChild(box);
  }

  board.appendChild(row);
}





document.getElementById("userInput").addEventListener("keydown", (event) => {
    if(event.key == "Enter"){
        if(event.target.value.length === secretWord.length){
            checkWord(event.target.value)
        }else{
            showTemporaryAlert("Votre mot est trop petit, choissiez un autre mot")
        }
    }
      
})





initializeWordList()




