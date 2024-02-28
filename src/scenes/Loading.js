class Loading extends Phaser.Scene {
    constructor() {
        super("LoadingScene")
    }

    preload() {
        this.load.bitmapFont('wgfont', 'assets/font/wargames.png', 'assets/font/wargames.xml')

        this.load.audio('kpshort', 'assets/audio/keypress/keypress_short.wav')
        this.load.audio('kplong', 'assets/audio/keypress/keypress_long.wav')


    }
    init() {
        this.introStarted = false
    }


    create() {
        this.myConsole = new TextInput(this, upperConsoleX, upperConsoleY, 'wgfont', "LOGON: Joshua")
        this.myConsole.startBufferOscillation()
        this.myConsole.startTyping()


        //all keyboard inputs
        {
            keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        }
    }


    update() {
        //SKIP INTRO (debug)
        this.scene.start("mainMenuScene")

        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.myConsole.setFast(true)
        }
        if (Phaser.Input.Keyboard.JustUp(keySPACE)) {
            this.myConsole.setFast(false)
        }

        if (Phaser.Input.Keyboard.JustDown(keyENTER) && !this.introStarted) {
            this.introStarted = true
            this.myConsole.clearText()
            this.myConsole.append_text_auto_type(startupMonologue)
            this.myConsole.onFinish = function () { this.scene.loadinCallback() }
        }
    }


    loadinCallback() {
        this.time.delayedCall(2000, ()=>{this.scene.start("mainMenuScene")})
    }
}