let config = {
    type: Phaser.AUTO,
    width: 1920,
    height:1080,
    render: {pixelArt: false},
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
            debug: true
        }
    },
    scene: [ Loading, Main, ]
}
let game = new Phaser.Game(config)


let { height, width } = game.config