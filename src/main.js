let config = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    render: { pixelArt: false },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
            debug: true
        }
    },
    scene: [Loading, MainMenu,]
}
let game = new Phaser.Game(config)


let { height, width } = game.config

let upperConsoleX = 16, upperConsoleY = 32
let leftConsoleX = 32, leftConsoleY = height/2 + 32
let rightConsoleX = width*3/8 + 32, rightConsoleY = height/2 + 32

//the Horrors
//my reasoning: it's fun to do it the old school style. Also - no input sanitization necessary. we convert only alphanum keystrokes directly into str.
//capital letters are a stretch goal. lmao
let key1, key2, key3, key4, key5, key6, key7, key8, key9, key0
let keyQ, keyW, keyE, keyR, keyT, keyY, keyU, keyI, keyO, keyP
let keyA, keyS, keyD, keyF, keyG, keyH, keyJ, keyK, keyL
let keyZ, keyX, keyC, keyV, keyB, keyN, keyM
let keyBACK, keyENTER, keySPACE