class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene")
    }

    preload() {


    }
    init() {

    }


    create() {

        this.blankPanel = this.add.rectangle(0, 0, width * 2, height * 2, 0x00000, 1)


        this.myConsole = new TextInput(this, upperConsoleX, upperConsoleY, 'wgfont', creditsText,30)
        this.myConsole.startBufferOscillation()
        this.myConsole.startTyping()


        //all keyboard inputs
        {
            keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        }
    }


    update() {
        

        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.resume("mainMenuScene")
            this.scene.get("mainMenuScene").mainConsole.unlockInput()
            this.scene.stop()
        }
    }



}