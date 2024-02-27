class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenuScene")
    }
    preload() {

    }

    init() {

    }

    create() {
        //all keyboard inputs
        {
            keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
            keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
            keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
            keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
            keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T)
            keyY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y)
            keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U)
            keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)
            keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)
            keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
            keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
            keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
            keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
            keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
            keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G)
            keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)
            keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J)
            keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
            keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
            keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
            keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
            keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
            keyV = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V)
            keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B)
            keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N)
            keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
            keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            keyBACK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE)
        }

        this.map = new Typewriter(this, upperConsoleX, upperConsoleY, "wgfont", USA_RUSSIA, 100)
        this.map.startTyping()
        this.map.setSpacesSkippable(true)
    }

    update() { }
}