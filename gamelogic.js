let canvas = document.getElementById('gameCanvas')
let ctx = canvas.getContext('2d')

canvas.addEventListener('click', function() { 
    if (displayMenu === false){spacePressed = true}
    });

document.addEventListener("keydown", flap)

if (sessionStorage.getItem('score')){
    document.getElementById('hiscore').innerText=  "High Score: " + sessionStorage.getItem('score') + " - " + sessionStorage.getItem('bestUser')
}

// initial bird placement
let spacePressed = false
let birdSize = 11
var x = canvas.width/4
var y = canvas.height-200
var dx = 2
var dy = 3 
let goingUp = false

let flapped = 0
let obstacleX = canvas.width - 100
let obstacleY = 100
let score = 0

//Set difficulty
let difficultyBar = document.getElementById('difficultybar')
difficultyBar.addEventListener('change', updateDifficulty)

let difficulty = 20
if (sessionStorage.getItem('difficulty')){
    difficulty = sessionStorage.getItem('difficulty')
    difficultyBar.value = difficulty
}

document.getElementById('getusername').addEventListener('submit', showgame)

//music setup
let music = document.getElementById('gamesound')
let endNoise = document.getElementById('endsound')
endNoise.loop = false
endNoise.volume = .2
let endsoundPlayed = false
let musicOn = sessionStorage.getItem('musicOn')
let soundButton = document.getElementById('soundbutton')

if (musicOn === true) {
    soundButton.innerHTML = '&#x1f50a'
} else {
    soundButton.innerHTML = '&#x1f507'
}

// load bird and cloud images
let image = new Image()
image.src = 'output-onlinepngtools.png'

let cloud = new Image()
cloud.src = 'cloud.png'
let cloudX = canvas.width
let cloudY = Math.random()*canvas.height

let displayMenu = true
let endMenu = false

if (sessionStorage.getItem('theme') === 'darkmode') {
    settheme('darkmode');
} else {
    settheme('lightmode');
}

function changetheme(){
    if (sessionStorage.getItem('theme') === 'darkmode') {
        settheme('lightmode');
        document.getElementById('switch').innerHTML = '&#x263E'
    } else {
        settheme('darkmode');
        document.getElementById('switch').innerHTML = '&#x263C'
    }
}

function settheme(theme){
    sessionStorage.setItem('theme', theme)
    document.documentElement.className= theme
    if (theme ==='darkmode') {
        document.getElementById('switch').innerHTML = '&#x263C'
    } else {
        document.getElementById('switch').innerHTML = '&#x263E'
    }
}


function showgame(){
    let username = this[0].value
    if (0 < username.length && username.length <= 15) {
        document.getElementById('gamebox').style.display = 'block'
        document.getElementById('usernameBox').style.display = 'none'
        sessionStorage.setItem('currentUser', username)
    } else {
        document.getElementById('errorMessage').style.display = 'block'
    }
    return false
}

function flap(e){
    if (e.key ===" "){
        spacePressed = true
    }
}

function playMusic(){
    if (musicOn === true){
        music.play()
    }
}

function playEndNoise(){
    if (endsoundPlayed === false && musicOn === true){
        endNoise.play()
        endsoundPlayed = true
    }
}

function togglemute(){
    let button = document.getElementById('soundbutton')
    if (musicOn === true){
        musicOn = false
        button.innerHTML = '&#x1f507'
        sessionStorage.setItem('musicOn', false)
    } else {
        musicOn = true
        button.innerHTML = '&#x1f50a'
        sessionStorage.setItem('musicOn', true)
    }
}

function updateDifficulty(){
    difficulty = document.getElementById('difficultybar').value
    sessionStorage.setItem('difficulty', difficulty)
}

function drawcloud(){
    ctx.drawImage(cloud, cloudX, cloudY)
    if (cloudX < 0) {
        cloudX = canvas.width
        cloudY = Math.random()*canvas.height
    }
}

function drawBird(){
    if (goingUp){
        ctx.save()
        ctx.translate(x-35, y-35)
        ctx.rotate(-30*Math.PI/180)
        ctx.drawImage(image, -15,10)
        ctx.restore()
    } else {
        ctx.save()
        ctx.translate(x-35, y-35)
        ctx.rotate(30*Math.PI/180)
        ctx.drawImage(image, 15,-19)
        ctx.restore()
    }
}


function drawObstacles(){
    let color = "#000000"
    if (sessionStorage.getItem('theme') === 'darkmode') { color = "#eeeeee" } 
    //bottom rectangle
    ctx.beginPath();
    ctx.rect(obstacleX, obstacleY + 150 - difficulty, 50, 300);
    ctx.fillStyle = color
    ctx.fill();
    ctx.closePath();

    //top rectangle
    ctx.beginPath();
    ctx.rect(obstacleX, 0, 50, obstacleY);
    ctx.fillStyle = color
    ctx.fill();
    ctx.closePath();

    if (obstacleX < 0) {
        updateScore()
        //reset obstacle position
        obstacleX = canvas.width
        obstacleY = Math.random()*(canvas.height - difficulty - 100) // -100 offset so gap isn't too low
    }
}

function endGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawcloud()
    drawObstacles()
    drawBird()
    drawScore()

    ctx.font = "24px Arial";
    ctx.fillStyle = "#eeeeee";
    ctx.fillText("PLAY AGAIN", 170, 170);
    canvas.addEventListener('click', newGame)
}


function newGame(){
    document.getElementById('score').innerText= "Score: " + 0
    canvas.removeEventListener('click', newGame)
    flapped = 0
    score = 0
    goingUp = false
    endMenu = false
    spacePressed = false
    cloudX = canvas.width
    obstacleX = canvas.width
    obstacleY = 100
    x = canvas.width/4
    y = canvas.height-200
    endsoundPlayed = false
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#eeeeee";
  ctx.fillText(`Score: ${score}`, 190, 30);
}

function checkCollisions(){
    // check staying in bounds
    if(y + dy > canvas.height-birdSize || y + dy < birdSize){
        endMenu = true
    }

    // check collisions, +10 to adjust lower hitbox
    if ((y - birdSize < obstacleY || y + birdSize +10 > obstacleY + 150 - difficulty) && (obstacleX < x && x < obstacleX+60)) {
        endMenu = true
    }

}

function flapWings() {
    if (flapped > 0) {
        y -= 15
        flapped -= 8
        goingUp = true
    } else {
        y += dy 
        goingUp = false
    }
}

function updateScore(){
    score += 1
    document.getElementById('score').innerText = "Score: " + score
    if (score > sessionStorage.getItem('score')) {
        sessionStorage.setItem('score', score)
        sessionStorage.setItem('bestUser', sessionStorage.getItem('currentUser'))
        document.getElementById('hiscore').innerText=  "High Score: " + score + " - " + sessionStorage.getItem('bestUser')
    }
    
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawcloud()
    drawObstacles()
    drawBird()
    drawScore()
    checkCollisions()
    flapWings()

    cloudX -= 3
    obstacleX -= 6
    
    if (spacePressed){
        flapped = 40
        spacePressed = false
    }
}

function playButtonPressed(){
    displayMenu = false
}

function drawMenu(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    ctx.fillStyle = "#eeeeee";
    ctx.fillText("PLAY", 210, 170);
    canvas.addEventListener('click', playButtonPressed)
}

function playGame(){
    if (displayMenu === true){
        drawMenu()
    } else if (endMenu === false){
        playMusic()
        drawGame()
    } else {
        music.pause()
        playEndNoise()
        endGame()
    }
}

setInterval(playGame, 10);
