// alex leghart

// graders: use command HELP GRADER to enter debug mode

// phaser components used: bitmap text, timers, post-processing, audio/sfx, finite state machine

// cool features you may miss during gameplay: see section 3 in the game manual for missile stuff
// the game also adjusts its difficulty based on the response time of the player; enemy country
// launches at a rate based off of the player's last five response times useing a sliding average window.
// additionally, the population statistics are drawn from the 1980 US & USSR census

//asset citations are on credits page in-game

/*
//random object picking code taken & slightly edited from https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object 
//info from https://en.wikipedia.org/wiki/United_States_Navy_submarine_bases 
// and https://en.wikipedia.org/wiki/List_of_United_States_Air_Force_installations

//United States population data retrieved from https://en.wikipedia.org/wiki/1980_United_States_census#City_rankings
//Soviet Union population data retrieved from https://sashamaps.net/docs/maps/biggest-soviet-cities/


*/



let config = {
    type: Phaser.WEBGL,
    width: 1080,
    height: 768,
    zoom: 0.9,
    render: { pixelArt: false },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
            debug: true
        }
    },
    scene: [Loading, MainMenu, ExitScene, Credits]
}
let game = new Phaser.Game(config)


let { height, width } = game.config

let upperConsoleX = 16, upperConsoleY = 32
let leftConsoleX = 32, leftConsoleY = height/2 + 32
let rightConsoleX = width*3/8, rightConsoleY = height/2 + 32

//the Horrors
//my reasoning: it's fun to do it the old school style. Also - no input sanitization necessary. we convert only alphanum keystrokes directly into str.
//capital letters are a stretch goal. lmao
let key1, key2, key3, key4, key5, key6, key7, key8, key9, key0, keyMINUS
let keyQ, keyW, keyE, keyR, keyT, keyY, keyU, keyI, keyO, keyP
let keyA, keyS, keyD, keyF, keyG, keyH, keyJ, keyK, keyL
let keyZ, keyX, keyC, keyV, keyB, keyN, keyM
let keyBACK, keyENTER, keySPACE, keyESC