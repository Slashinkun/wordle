


let wordList = []
let secretWord = ""
let maxGuesses = 6
let totalGuess = 0

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
}



function initializeWordList(){
    fetch("mots.txt").then(response => response.text())
    .then(text => {
         wordList = text.split(/\r?\n/).filter(Boolean);
         wordList = wordList.map(word => removeAccents(word));
         wordList = wordList.filter((word) => word.length < 7)
         startGame();
        })
        .catch(err => {
            console.error("Erreur pendant la recuperation de la liste de mot",err)
        })
}


function startGame(){
    userTries.innerText = ` Tentatives : ${totalGuess}/${maxGuesses}`
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    userInput.maxLength = secretWord.length
    userInput.placeholder = `${secretWord.length} lettres`
    console.log("Mot secret :", secretWord);
    console.log(countLetters(secretWord))
}


function checkWord(word){
    
    if (word === secretWord){
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
    }else if(wordList.find((w) => w === word)){
        console.log(wordList.find((w) => w === word))
        addWordRow(word,secretWord)
        totalGuess++;
    }else{
        alertUser.innerText = "Votre mot n'existe pas, veuillez reessayez"
        setTimeout(() => {alertUser.innerText = ""},1000)
    }

    if(totalGuess === maxGuesses){
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

//retourne une balise li avec le resultat du mot
// function addLineGuess(word){
//     let secretWordLetter = countLetter(secretWord)
//     let guessElement = document.createElement("li")

//     let states = new Array(word.length).fill("incorrect");

//     for (let i = 0; i < word.length; i++) {
//         let guessChar = word[i];
//         let secretChar = secretWord[i];

//         if (guessChar === secretChar) {
//             states[i] = "correct";
//             secretWordLetter[guessChar]--;
//         }
//     }

//     for (let i = 0; i < word.length; i++) {
//         let guessChar = word[i];

//         if (states[i] === "incorrect" && secretWordLetter[guessChar] > 0) {
//             states[i] = "almost";
//             secretWordLetter[guessChar]--;
//         }
//     }

//     for (let i = 0; i < word.length; i++){
//         let letter = document.createElement("span");
//         letter.innerText = word[i];
//         letter.className = states[i];
//         guessElement.appendChild(letter)
//     }

//     userGuess.appendChild(guessElement)

// }

function addWordRow(guess, secretWord) {
  const board = document.getElementById("wordle-board");
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




document.getElementById("userInput").addEventListener("keydown", (event) => {
    if(event.key == "Enter"){
        if(event.target.value.length === secretWord.length){
            checkWord(event.target.value)
        }else{
            alertUser.innerText = "Votre mot est trop petit, choissiez un autre mot"
            setTimeout(() => {alertUser.innerText = ""},1000)
        }
    }
      
})




const alertUser =  document.getElementById("alert")
const userTries = document.getElementById("userTries")
const userInput = document.getElementById("userInput")
const userGuess = document.getElementById("userGuess")

initializeWordList()




