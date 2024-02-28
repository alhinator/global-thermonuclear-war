class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenuScene")
    }
    preload() {

    }

    init() {
        this.state = "drawingMap"
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
            key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
            key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
            key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
            key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
            key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE)
            key6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX)
            key7 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN)
            key8 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT)
            key9 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE)
            key0 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO)
            keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            keyBACK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE)
            keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        }
        this.input.keyboard.on('keydown', this.mainConsoleListener,this)

        this.map = new Typewriter(this, upperConsoleX, upperConsoleY, "wgfont", USA_RUSSIA_new, 20)
        this.map.setSpacesSkippable(true)
        this.map.onFinish = function (){this.scene.mapFinishedCallback()}
        this.map.startTyping()

        //SKIP MAP THANG
        this.map.finishTyping()

    }

    update() { 
        this.handleStateAction()
    }


    mapFinishedCallback(){
        this.state = "pregame"
        this.mainConsole = new TextInput(this, leftConsoleX, leftConsoleY, "wgfont", whichSideText)
        this.mainConsole.startBufferOscillation()
        this.mainConsole.startTyping()
    }

    handleStateAction(){
        switch(this.state){
            case "drawingMap":
                break;
            case "pregame":
                if(!this.mainConsole.allowInput && this.mainConsole.state == "done") {this.mainConsole.unlockInput()}
        }
    }

    userHitEnter(){
        //do stuff
    }

    mainConsoleListener(){
        console.log("in keyboard listener")
        this.mainConsole.handleInput(this)
    }
}