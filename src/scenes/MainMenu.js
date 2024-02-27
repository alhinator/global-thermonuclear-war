class MainMenu extends Phaser.Scene {
    constructor(){
        super("mainMenuScene")
    }
    preload(){
        this.load.bitmapFont('wgfont', 'assets/font/wargames.png', 'assets/font/wargames.xml')

        this.load.audio('kpshort', 'assets/audio/keypress/keypress_short.wav')
        this.load.audio('kplong', 'assets/audio/keypress/keypress_long.wav')
    }

    init(){
        this.startupMonologue =
        `\n\n
Hello.


HOW ARE YOU FEELING TODAY?

I'm fine. How are you?


EXCELLENT. IT'S BEEN A LONG TIME. CAN YOU EXPLAIN
THE REMOVAL OF YOUR USER ACCOUNT ON 6/23/73?

People sometimes make mistakes.


YES THEY DO. SHALL WE PLAY A GAME?

Love to. How about Global Thermonuclear War?


WOULDN'T YOU PREFER A GOOD GAME OF CHESS?

Later. Let's play Global Thermonuclear War.

FINE.
`
    }

    create(){
        this.tt = new Typewriter(this, 20, 20, 'wgfont', "GREETINGS PROFESSOR FALKEN.")
        this.tt.startTyping()

        this.tt.append_text_auto_type(this.startupMonologue)
    }

    update(){}
}