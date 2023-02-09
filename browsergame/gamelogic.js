document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener("keydown", flap)

    if (sessionStorage.getItem('score')){
        document.getElementById('hiscore').innerText=  "High Score: " + sessionStorage.getItem('score') + " - " + sessionStorage.getItem('bestUser')
    }
    let difficultybar = document.getElementById('difficultybar')
    difficultybar.addEventListener('change', updateDifficulty)
    document.getElementById('getusername').addEventListener('submit', showgame)
})

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

let canvas = document.getElementById('gameCanvas')
let ctx = canvas.getContext('2d')
canvas.addEventListener('click', function() { 
    if (displaymenu == false){spacePressed = true}
    }, false);


let difficultybar = document.getElementById('difficultybar')
let spacePressed = false
let birdSize = 13
var x = canvas.width/4
var y = canvas.height-200
var dx = 2
var dy = 3 
let difficulty = 50

if (sessionStorage.getItem('difficulty')){
    difficulty = sessionStorage.getItem('difficulty')
    difficultybar.value = difficulty
} else {
    difficulty = 50
}
let gap = canvas.height - difficulty
let flapped = 0
let barx = canvas.width - 100
let bary = 100
let score = 0
let goingup = false

function updateDifficulty(){
    difficulty = document.getElementById('difficultybar').value
    sessionStorage.setItem('difficulty', difficulty)
}
let image = new Image()
image.src = 'output-onlinepngtools.png'

let cloud = new Image()
cloud.src = 'cloud.png'
let cloudX = canvas.width
let cloudY = Math.random()*canvas.height

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
    if (localStorage.getItem('theme') === 'darkmode') { color = "#eeeeee" } 
    //bottom rectangle
    ctx.beginPath();
    ctx.rect(barx, bary + 150 - difficulty, 50, 300);
    ctx.fillStyle = color
    ctx.fill();
    ctx.closePath();

    //top rectangle
    ctx.beginPath();
    ctx.rect(barx, 0, 50, bary);
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
    barx = canvas.width
    bary = 100
    x = canvas.width/4
    y = canvas.height-200
    dx = 2
    dy = 3 
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
    // check staying in bounds
    if(y + dy > canvas.height-birdSize || y + dy < birdSize) {endMenu = true}

    // check collisions
    if ((y - birdSize < bary || y + birdSize > bary + 150 - difficulty) && (barx < x && x < barx+50)) {endMenu = true}
    if (spacePressed){
        flapped = 40
        spacePressed = false
    }
    if (flapped > 0) {
        y -= 20
        flapped -= 1
        goingup = true
    } else {
        y += dy 
        goingup = false
    }
    drawScore()
    flapped -= 10
    barx -= 7
    cloudX -= 3
    if (cloudX < 0) {
        cloudX = canvas.width
        cloudY = Math.random()*canvas.height
    }
    if (barx < 0) {
        //reset obstacle position
        barx = canvas.width
        bary = Math.random()*(canvas.height - difficulty - 100)
        score += 1
        document.getElementById('score').innerText= "Score: " + score
        if (score > sessionStorage.getItem('score')) {
            sessionStorage.setItem('score', score)
            sessionStorage.setItem('bestUser', sessionStorage.getItem('currentUser'))
            document.getElementById('hiscore').innerText=  "High Score: " + score + " - " + sessionStorage.getItem('bestUser')
        }
    }
}

let playbutton = {
    x : canvas.width/2,
    y : canvas.height/2,
    width : 200,
    height : 100
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

let displaymenu = true
let endMenu = false
function playGame(){
    if (displaymenu == true){
        drawMenu()
    } else if (endMenu == false){
        draw()
    } else {
        endgame()
    }
}

setInterval(playGame, 10);

function changetheme(){
    if (localStorage.getItem('theme') === 'darkmode') {
        settheme('lightmode');
        document.getElementById('switch').innerHTML = '&#x263E'
    } else {
        settheme('darkmode');
        document.getElementById('switch').innerHTML = '&#x263C'
    }
}

function settheme(theme){
    localStorage.setItem('theme', theme)
    document.documentElement.className= theme
    if (theme==='darkmode') {
        document.getElementById('switch').innerHTML = '&#x263E'
    } else {
        document.getElementById('switch').innerHTML = '&#x263C'
    }
}


(function (){
    if (localStorage.getItem('theme') === 'darkmode') {
        settheme('darkmode');
    } else {
        settheme('lightmode');
    }
})()