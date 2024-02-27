let config = {
    type: Phaser.WEBGL,
    width: 1024,
    height:768,
    render: {pixelArt: false},
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
            debug: true
        }
    },
    scene: [ Loading, MainMenu, ]
}
let game = new Phaser.Game(config)


let { height, width } = game.config
