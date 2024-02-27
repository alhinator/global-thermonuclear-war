class MainMenu extends Phaser.Scene {
    constructor(){
        super("mainMenuScene")
    }
    preload(){
        this.load.bitmapFont('wgfont', 'assets/font/wargames.png', 'assets/font/wargames.xml')
    }

    init(){}

    create(){
        this.tt = new Typewriter(this, 0, 0, 'wgfont', "HELLO PROFESSOR FALKEN")
        this.tt.startTyping()
    }

    update(){}
}