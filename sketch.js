let currentPage = '#splash'
//let's imagine we get the layers, pictures and correct answer from the master 
let players = ['anna', 'rikke', 'charlie', 'benny']
let colors = ['#ED5F59', '#FED26A', '#59C3BC', '#D3C3E1']
let pictures = ['./assets/player1.jpg', './assets/player2.jpeg', './assets/player3.jpeg', './assets/player4.webp']
let correct = 3
let myScore = 0
let voted = 0
let video

function setup(){
    //to do - brug rigtigt navn og send til master
    select('#name').value(players[0])
    
    setTimeout(() => shift('#names'), 1000)

    select('#nameOkay').mousePressed( ready )

    select('#selfieOkay').mousePressed( saveSelfie )
    select('#phoneOkay').mousePressed( drawing )
    select('#showOkay').mousePressed( vote )
    select('#nextRound').mousePressed( nextRound )
}

function ready() {
    players[0] = select('#name').value()
    select('#playerList').html(players.join('<br>'))
    shift('#wait')
    setTimeout(selfie, 2000)
}
function selfie () {
    console.log('selfie start')
    video = createCapture(VIDEO);
    video.size(windowWidth, windowWidth)
    select('#video').html('')
    select('#video').child(video)
    shift('#selfie')
}

function saveSelfie () {
    //to do: upload image to firestore
    video.loadPixels()
    pictures[1] = video.canvas.toDataURL()
    video.stop()
    setTimeout( () => shift('#downPhone'), 1000 )
}

function drawing() {
    let seconds = 6
    select('#draw').style('backgroundImage', 'url('+ random(pictures) +')')
    let i = setInterval( () => {
        seconds--
        select('#timer').html(seconds)
        if(seconds==0) {
            clearInterval(i)
            shift('#show')
        }
    }, 1000)
    shift('#draw')
}

function vote(){
    if(voted == players.length){
        score()
        return
    } 
    select('#voted').html(players[voted])
    select('#voted').style('color', colors[voted])
    //delete former pictures
    select('#voteBoxes').html('')
    //run through the pictures array and apply them to the img tags
    pictures.map( (pic, index) => {    
        let img = createElement('img')
        img.elt.src = pic
        img.style('border', '8px solid ' + colors[index])
        //set up a listener to check vote
        //to do - make shure you can't vote for yourself
        img.mousePressed( () => {
            console.log( index == correct ? 'yeah' : 'Noo')
            if(index!=correct){
                img.style('border', '8px solid black')
            }else{
                img.style('border-radius', '50%')
                myScore++
            }
            setTimeout(vote, 800)
        })
        select('#voteBoxes').child(img)
    })
    shift('#vote')
    voted++
}

function score(){
    select('#scoreTable').style('height', myScore * 10 + 'vh')
    select('#scoreNumber').html(myScore)
    shift('#score')
}

function nextRound(){
    //TODO - send points and readysignal to server
    myScore = 0
    voted = 0
    selfie()
}

function finish(){
}

function shift (newPage) {
    console.log('shift: ', newPage)
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}    

function keyPressed(key) {
    if (key.key == 1) shift('#splash')
    if (key.key == 2) shift('#names')
    if (key.key == 3) shift('#task')
}

