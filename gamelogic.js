document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener("keydown", flap)

    if (sessionStorage.getItem('score')){
        document.getElementById('hiscore').innerText=  "High Score: " + sessionStorage.getItem('score') + " - " + sessionStorage.getItem('bestUser')
    }
    let difficultybar = document.getElementById('difficultybar')
    difficultybar.addEventListener('change', updateDifficulty)
    document.getElementById('getusername').addEventListener('submit', showgame)




})

let canvas = document.getElementById('gameCanvas')
let ctx = canvas.getContext('2d')
canvas.addEventListener('click', function() { 
    if (displaymenu == false){spacePressed = true}
    });

// initial bird placement
let spacePressed = false
let birdSize = 13
var x = canvas.width/4
var y = canvas.height-200
var dx = 2
var dy = 3 
let goingup = false

let flapped = 0
let obstacleX = canvas.width - 100
let obstacleY = 100
let score = 0
//default difficulty
let difficulty = 25
let difficultybar = document.getElementById('difficultybar')

if (sessionStorage.getItem('difficulty')){
    difficulty = sessionStorage.getItem('difficulty')
    difficultybar.value = difficulty
}

//music setup
let music = document.getElementById('gamesound')
let endnoise = document.getElementById('endsound')
endnoise.loop = false
endnoise.volume = .2
let endsoundplayed = false
let musicOn = sessionStorage.getItem('musicOn')
let soundbutton = document.getElementById('soundbutton')

if (musicOn == true) {
    soundbutton.innerText = 'Mute'
} else {
    soundbutton.innerText = 'Unmute'
}

// load bird and cloud images
let image = new Image()
image.src = 'output-onlinepngtools.png'

let cloud = new Image()
cloud.src = 'cloud.png'
let cloudX = canvas.width
let cloudY = Math.random()*canvas.height

let displaymenu = true
let endMenu = false

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
    if (theme==='darkmode') {
        document.getElementById('switch').innerHTML = '&#x263C'
    } else {
        document.getElementById('switch').innerHTML = '&#x263E'
    }
}

(function (){
    if (sessionStorage.getItem('theme') === 'darkmode') {
        settheme('darkmode');
    } else {
        settheme('lightmode');
    }
})()

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

function playmusic(){
    if (musicOn == true){
        music.play()
    }
}

function playEndNoise(){
    if (endsoundplayed == false && musicOn == true){
        endnoise.play()
        endsoundplayed = true
    }
}

function togglemute(){
    let button = document.getElementById('soundbutton')
    if (musicOn == true){
        musicOn = false
        button.innerText = 	'Unmute'
        sessionStorage.setItem('musicOn', false)
    } else {
        musicOn = true
        button.innerText = 'Mute'
        sessionStorage.setItem('musicOn', true)
    }
}

function updateDifficulty(){
    difficulty = document.getElementById('difficultybar').value
    sessionStorage.setItem('difficulty', difficulty)
}

function drawcloud(){
    ctx.drawImage(cloud, cloudX, cloudY)
}

function drawBird(){
    if (goingup){
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
}

function endgame() {
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
    goingup = false
    endMenu = false
    spacePressed = false
    cloudX = canvas.width
    obstacleX = canvas.width
    obstacleY = 100
    x = canvas.width/4
    y = canvas.height-200
    dx = 2
    dy = 3 
    endsoundplayed = false
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#eeeeee";
  ctx.fillText(`Score: ${score}`, 190, 30);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawcloud()
    drawObstacles()
    drawBird()
    drawScore()

    // check staying in bounds
    if(y + dy > canvas.height-birdSize || y + dy < birdSize) {endMenu = true}

    // check collisions
    if ((y - birdSize < obstacleY || y + birdSize > obstacleY + 150 - difficulty) && (obstacleX < x && x < obstacleX+50)) {endMenu = true}
    if (spacePressed){
        flapped = 40
        spacePressed = false
    }
    if (flapped > 0) {
        y -= 20
        flapped -= 10
        goingup = true
    } else {
        y += dy 
        goingup = false
    }

    obstacleX -= 7
    cloudX -= 3
    if (cloudX < 0) {
        cloudX = canvas.width
        cloudY = Math.random()*canvas.height
    }
    if (obstacleX < 0) {
        //reset obstacle position
        obstacleX = canvas.width
        obstacleY = Math.random()*(canvas.height - difficulty - 100)
        score += 1
        document.getElementById('score').innerText= "Score: " + score
        if (score > sessionStorage.getItem('score')) {
            sessionStorage.setItem('score', score)
            sessionStorage.setItem('bestUser', sessionStorage.getItem('currentUser'))
            document.getElementById('hiscore').innerText=  "High Score: " + score + " - " + sessionStorage.getItem('bestUser')
        }
    }
}

function playButtonPressed(){
    displaymenu = false
}

function drawMenu(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    ctx.fillStyle = "#eeeeee";
    ctx.fillText("PLAY", 210, 170);
    canvas.addEventListener('click', playButtonPressed)
}

function playGame(){
    if (displaymenu == true){
        drawMenu()
    } else if (endMenu == false){
        playmusic()
        draw()
    } else {
        music.pause()
        playEndNoise()
        endgame()
    }
}

setInterval(playGame, 10);
