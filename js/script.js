var killed = false;
var gunImg = 'gun1'

var gunshot = document.getElementById('gunshot-sfx')
let gun = document.getElementById('gun');

var intervalIDs = []
var timeouts = []
var levelUp = []

document.getElementById('play').style = `background-image: url("./assets/imgs/rgb${Math.floor(Math.random() * 16)}.gif"); `

window.addEventListener('mousedown', () => {
    gunshot.currentTime = 0;
    gunshot.play()

    // change gun img to firing
    gun.setAttribute("src", `assets/imgs/${gunImg}-fire${Math.floor(Math.random() * 3 + 1)}.png`);

    // Reset gun img after firing
    setTimeout(() => {
        gun.setAttribute("src", `assets/imgs/${gunImg}.png`);
    }, 100);
})

function clearCanvas() {
    document.getElementById('game').removeChild(document.getElementById('targets'))

    intervalIDs.forEach(e => clearInterval(e))
    intervalIDs = []

    levelUp.forEach(e => clearInterval(e))
    levelUp = []

    timeouts.forEach(e => clearTimeout(e))
    timeouts = []
}

// PLAY FUNCTION:
function play() {
    document.getElementById("play").style = "display: none"
    document.getElementById('bg-music').play()
    document.getElementById("game").style = "display: block"
    document.getElementById("gun").style = "display: inline"

    // CHANGING GUNS
    timeouts.push(setTimeout(() => {
        gunImg = 'gun2'
        let gun = document.getElementById('gun')
        gun.setAttribute("src", "assets/imgs/gun2.png");
        gun.style.width = "53%"; // Decrease width by 2%
        gun.style.height = "46%"; // Decrease height by 2%
    }, 23000))

    timeouts.push(setTimeout(() => {
        gunImg = 'gun3'
        let gun = document.getElementById('gun')
        gun.setAttribute("src", "assets/imgs/gun3.png");
        gun.style.width = "52%"; // Decrease width by 2%
        gun.style.height = "48%"; // Decrease height by 2%
    }, 47000)) //HARD LEVEL: Gun 3

    timeouts.push(setTimeout(() => {
        gunImg = 'gun4'
        let gun = document.getElementById('gun')
        gun.setAttribute("src", "assets/imgs/gun4.png");
        gun.style.width = "49%"; // Decrease width by 2%
        gun.style.height = "48%"; // Decrease height by 2%
    }, 93000))

    timeouts.push(setTimeout(() => {
        gunImg = 'gun5'
        let gun = document.getElementById('gun')
        gun.setAttribute("src", "assets/imgs/gun5.png");
        gun.style.width = "49%"; // Decrease width by 2%
        gun.style.height = "48%"; // Decrease height by 2%
    }, 116000))

    timeouts.push(setTimeout(() => {
        gunImg = 'gun6'
        let gun = document.getElementById('gun')
        gun.setAttribute("src", "assets/imgs/gun6.png");
        gun.style.width = "57%"; // Decrease width by 2%
        gun.style.height = "55%"; // Decrease height by 2%
    }, 139000))


    // LEVELUP (FOR SONG 1)
    // Bring in a randomg gif of monster scaring person for a sec
    timeouts.push(setTimeout(() => {
        levelUp.push(setInterval(addTargets, 1500))
    }, 22000))

    timeouts.push(setTimeout(() => {
        levelUp.push(setInterval(addTargets, 900))
    }, 46000)) //Gun 3 (HARD LEVEL)

    timeouts.push(setTimeout(() => {
        levelUp.forEach(e => clearInterval(e))
        levelUp = []
    }, 93000)) // RESET SPEED

    timeouts.push(setTimeout(() => {
        levelUp.push(setInterval(addTargets, 1500))
    }, 115000))

    timeouts.push(setTimeout(() => {
        levelUp.push(setInterval(addTargets, 900))
    }, 138000)) // Gun 6 Machine Gun (HARD LEVEL)

    timeouts.push(setTimeout(() => {
        levelUp.forEach(e => clearInterval(e))
        levelUp = []
    }, 186000))

    intervalIDs.push(setInterval(addTargets, 800))

    // MENU OPTION ON ESC KEY PRESS
    var menuOpen = false
    document.addEventListener('keydown', e => {
        console.log(e.key)
        if (e.key === "Escape") {
            if (menuOpen === false) {
                document.getElementById('menu').style = 'display: block'
                menuOpen = true

            } else {
                document.getElementById('menu').style = 'display: none'
                menuOpen = false
            }
        }
    })
} // ---------- PLAY function ends ---------- 

window.ondragstart = function () { return false } // disabling drag-ability of items

document.addEventListener('contextmenu', event => event.preventDefault()); // disabling right click

var count = 1;
function addTargets() {
    var targets = document.getElementById('targets');
    var img = document.createElement('img');
    img.src = 'assets/targets/zombie1.gif';

    img.id = `target${count}`

    targets.appendChild(img);

    showTargets(
        `target${count}`,
        Number(`${Math.floor(Math.random() * 60)}`),
        Number(`${Math.floor(Math.random() * 60)}`)
    )

    count++;
}

function showTargets(id, r, t) {
    let h = 16;
    let w = 7;

    let arr = ['left', 'right']
    let position = arr[Math.floor(Math.random() * 2)]

    let targetElement = document.getElementById(id);
    function increaseSize() {
        targetElement.style = `
        position: absolute;
        ${position}: ${r}%;
        top: ${t}%;
        height: ${h}%; 
        width: ${w}%;
        z-index: 10;`

        h += 0.2;
        w += 0.1;

        if (h > 100) {
            // const element = document.getElementById(`${id}`)
            // document.getElementById('game').removeChild(element)
            killed = true;

            const blood = document.getElementById('blood')
            blood.style = 'display: block'
            // document.getElementById('score').style = 'display: none;'

            document.getElementById('game-over').style = 'display: block'
            document.body.style = 'cursor: pointer'

            clearCanvas();
            document.getElementById('bg-music').pause()
            document.getElementById('bg-music').currentTime = 0;

            // play random death sfx

            return
        };
    }

    var targetShowerId = setInterval(increaseSize, 10)
    intervalIDs.push(targetShowerId)

    targetElement.addEventListener('mousedown', () => {
        kill(targetElement, targetShowerId);
    });
}

function kill(id, intervalID) {
    document.getElementById('targets').removeChild(id)
    clearInterval(intervalID)
}

// document.getElementById('bg-music').duration

// add more guns on timestamps
// change bg video on timestamps
// add chaos on timestamps
// death sfx on death
// stats store in localstorage if not signed up
// on death screen, give option: signup to save your score on the leaderboard.
// under the restart button on death screen, there will be the leaderboard
// if user completes the game: holy shit u won!. massive w. take a snapshot option
// add google or umami analytics

/*
i can write styles of divs which will have url() and positoios
diff styles for diff gifs that will cause chaos in screen

write them and put in array
setTimeout and display random itrm from the aray on screen

revet back to display none.

setTimeout(()=>{
    display the img

    setTimeout(()=>{
        display none}, 5000)
    },10000)
*/