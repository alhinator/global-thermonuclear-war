class ExitScene extends Phaser.Scene{
    constructor(){
        super('exitScene')
    }

    create(){
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

        this.ct = new Typewriter(this, upperConsoleX, upperConsoleY, "wgfont", "CONNECTION TERMINATED. PRESS ENTER TO RE-ESTABLISH.", 20)
        this.ct.startTyping()
    }
    update(){
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
            this.scene.start("mainMenuScene")
        }
    }
}