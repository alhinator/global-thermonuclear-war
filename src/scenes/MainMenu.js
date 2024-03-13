class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenuScene")
    }
    preload() {

    }

    init() {
        this.alreadyWarnedMe = false
        this.alreadyWarnedThem = false
        this.alreadyWarnedThemMissiles = false
        this.gameEndBool = false

        this.lastInjIrrTick = 8000
        this.enemyAggroTick = 20000
        this.enemyAggroLow = 16000
        this.enemyAggroHigh = 32000

        this.timeSincePlayerResponse = 0

        //start with faux player response times; this allows the game ai to 
        // start at middling difficulty and adapt as the player plays.
        this.playerResponseTimes = [25000]
        this.playerResponseSlidingAverage = 25000

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
            keyMINUS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS)
            keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            keyBACK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE)
            keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        }
        ///make fsm
        this.GameManager = new GameManager(this)

        //console.log('done making fsm')
        //create map & console & timer, but do nothing with it yet.
        this.map = new Typewriter(this, upperConsoleX, upperConsoleY, "wgfont", USA_RUSSIA_new, 20)
        this.map.setSpacesSkippable(true)
        this.map.onFinish = function () { this.scene.GameManager.FSM.transition("SideSelect") }

        this.mainConsole = new TextInput(this, leftConsoleX, leftConsoleY, "wgfont", whichSideText)
        this.input.keyboard.on('keydown', this.mainConsoleListener, this)

        this.infoPanel = new Typewriter(this, rightConsoleX, rightConsoleY, "wgfont", "", 16)

        this.gameTimerText = new Typewriter(this, rightConsoleX, rightConsoleY - 32, "wgfont", "", 16, 0)
        this.gameTimerText.activateGlow()
        //console.log("mm: create: " + this.gameTimerText.text)

        this.airspaceAlert = new Typewriter(this, rightConsoleX, rightConsoleY - 64, "wgfont", "", 16, 0)
        this.airspaceAlert.onFinish = function () {
            this.scene.time.delayedCall(5000, () => {
                if (this.state = "done") { //in-case it gets overwritten.
                    panel_clear_called(this.scene, this.scene.GameManager, this)
                }
            }, null, this)
        }




        //divider stuff for missiles and cities. debug
        //this.r1 = new Typewriter(this, 55, 85, "wgfont", "@", 16, 0)
        //this.r1.startTyping()



    }

    update(time, delta) {
        this.GameManager.FSM.step()
        this.GameManager.incTimer(delta)
        if (this.GameManager.gameRawTime >= this.lastInjIrrTick) {
            this.lastInjIrrTick += 6000
            tickAllCityPops(this, this.GameManager)
            //console.log("done ticking city pops")
            //check game winCons.
            winCons(this, this.GameManager)
        }


        if (this.GameManager.gameRawTime >= this.enemyAggroTick) {
            computeEnemyAggroTimes(this, this.GameManager)
            this.enemyAggroTick += Phaser.Math.Between(this.enemyAggroLow, this.enemyAggroHigh)
            enemyAttack(this, this.GameManager)
        }

        //set clock text to game time.
        if (this.GameManager.gameRawTime != 0) {
            // console.log("game timeer tick")
            this.gameTimerText.text = this.GameManager.gameTime
        }
    }

    userHitEnter() {
        this.GameManager.FSM.recieveReturnKey()
    }

    mainConsoleListener() {
        //console.log("in keyboard listener")
        this.mainConsole.handleInput(this)
    }
}