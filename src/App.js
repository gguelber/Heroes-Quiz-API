import React, {useState, useEffect} from 'react';
import Countdown, { zeroPad, calcTimeDelta, formatTimeDelta } from 'react-countdown-now';
import Image from './marvel-vs-dc.jpeg'
import './App.css'

export default function App() {

  const [ database, setDatabase ] = useState([])
  const [ correct, setCorrect ] = useState(0)
  const [ score, setScore ] = useState(0)
  const [ numRounds, setNumRounds ] = useState(10)
  const [ maximumScore, setMaximumScore ] = useState((numRounds * 20) + 60)
  const [ endGame, setEndGame ] = useState(false)
  const [ isPlaying, setIsPlaying ] = useState(false)
  const [ dateNow, setDateNow ] = useState(0)

  const randomArray = []
  const correctArray = []
  let correctAnswer = 0
  let test = 0
  

// Function to get all data from the API and store in the state
  async function getData() {
    try {
      const res = await fetch('https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/all.json')
      const data = await res.json()
      setDatabase(data)
    } catch (error) {
      console.log(error)
    }
  }
  

//Function to generate 3 random heroes and fill the 3 alternatives with their respective names

  function randomNumbers() {
    setNumRounds(numRounds => numRounds - 1)
    
    for (let i=0; i<3; i++) {
      randomArray.push(Math.floor(Math.random() * database.length))
      document.getElementById(i).innerHTML = database[randomArray[i]].name
    }
    console.log(`Database Length: ${database.length}`)
    chooseCorrectAnswer()
    console.log(`currentQuestion ID's: ${database[randomArray[0]].id} - ${database[randomArray[1]].id} - ${database[randomArray[2]].id}`)
  }

  //Function to choose a random number from 0 to 2 and set the correct answer

  function chooseCorrectAnswer() {
    correctAnswer = Math.floor(Math.random() * 3)
    setCorrect(correctAnswer)
    correctArray.push(database[randomArray[correctAnswer]].id)
    document.getElementById('mainImg').src = database[randomArray[correctAnswer]].images.lg
    
    console.log(`CorrectArray (Correct Answer ID): ${correctArray}`)
    console.log(`Correct Answer: ${correctAnswer}`)
  }


  //Function to check if the clicked button corresponds to the correct answer. If its correct, add 20 points to the score. Calls the next question if there are remaining rounds or end the game, if there arent.
  function checkAnswer(e) {
    console.log(`Random Array: ${randomArray}`)
    console.log(`Correct Answer: ${correctAnswer}`)
    if (e == correct) {
      setScore(score + 20)
    }
    if (numRounds < 1) {
      test = ((dateNow - Date.now()) / 1000)
      setScore(score => score + test)
      console.log(`Score + Test = ${score}`)
      setEndGame(true)
    }
    randomNumbers()
  }

  function startGame() {
    
    setIsPlaying(true)
    setEndGame(false)
    setNumRounds(10)
    setScore(0)
    setDateNow(dateNow => Date.now() + 60000)
    setTimeout(() => {
      
      randomNumbers()
    }, 2000);
    console.log(dateNow)
  }


  useEffect(() => {
    getData()
  },[])



  if (endGame) {
    return (
      <div className="endingDiv">
        <h1>Fim de Jogo!</h1>
        <h1>Sua pontuação total foi: {score}</h1>
        <h1>Parabéns! Você obteve {((score/maximumScore) * 100).toFixed(2)}% da pontuação maxima!</h1>
        <button onClick={startGame}>Clique para jogar novamente</button>

      </div>
    )
  } else if (!isPlaying) {
    return(
      <div className="startingDiv">
        <h1>Bem Vindo ao Hero Quiz!</h1>
        <img id="mainImg" src={Image} alt="Hero Image"/>
        <button onClick={startGame}>Clique aqui para Iniciar</button>
      </div>
    )  
  } else {
    return (
      <div className="mainDiv">
        <Countdown date={dateNow} onComplete={() => setEndGame(true)} />
        <h2>Perguntas Restantes: {numRounds}</h2>
        <h1>Qual o nome do personagem abaixo?</h1>
        <img id="mainImg" src={Image} alt="Hero Image"/>
        <button id="0" onClick={e => checkAnswer(e.target.id)}>{randomArray[0]}</button>
        <button id="1" onClick={e => checkAnswer(e.target.id)}>{randomArray[1]}</button>
        <button id="2" onClick={e => checkAnswer(e.target.id)}>{randomArray[2]}</button>
        <h3>Pontuação: {score}</h3>
      </div>
    )
  }
}
