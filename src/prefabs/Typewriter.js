class Typewriter extends Phaser.GameObjects.BitmapText {
    constructor(scene, x, y, font, _full_text, _speed = 30, size = 16, align = 'left') {
        super(scene, x, y, font, "", size, align)
        scene.add.existing(this)

        this.full_text = _full_text


        // the states of a typewriter: initial, typing, done
        this.state = "waiting"

        this.speed = _speed
        this.fastSpeed = _speed / 4
        this.goingFast = false

        this.typeIndex = 0
        this.isGlowing = false

        this.skipSpaces = false

        this.onFinish = function () { console.log("Finished Typing!") }
    }

    //command functions

    startTyping() {
        if (this.state == "typing") { return }

        this.activateGlow()
        this.state = "typing"
        this.typeGlyph()
    }
    startTypingWithoutGlow() {
        if (this.state == "typing") { return }

        //this.activateGlow()
        this.state = "typing"
        this.typeGlyph()
    }
    finishTyping() {
        if (this.state != "typing") { return }
        this.state = "done"
        this.text = this.full_text
        this.typeIndex = this.full_text.length
        this.onFinish()
    }
    clearText() {
        this.text = ""
        this.full_text = ""
        this.typeIndex = 0
    }
    activateGlow() {
        if (this.isGlowing) { return }
        this.isGlowing = true
        this.postFX.addGlow(0x7797e0, 1, 0.8, false, 0.1, 15)
    }
    typeGlyph() {
        if (this.state == "done" || this.typeIndex >= this.full_text.length) {
            if (this.state != "done") { //short circut to prevent onFinish from getting called twice if finishtyping() is called
                this.state = "done"
                this.onFinish()
            }
            return
        }
        //console.log(this.full_text)
        //add the next index or multiple if skipping spaces.
        let charr = this.full_text[this.typeIndex]

        this.text += charr
        this.typeIndex++
        if (isntWhitespace(charr)) {
            this.scene.sound.play('kpshort', { loop: false, volume: 0.2 })
        }

        if (this.skipSpaces && !isntWhitespace(charr)) {
            while (!isntWhitespace(charr) && this.typeIndex < this.full_text.length) {
                charr = this.full_text[this.typeIndex]
                this.text += charr
                this.typeIndex++
            }
        }

        
        let delay = this.goingFast ? this.fastSpeed : this.speed
        this.scene.time.delayedCall(delay, () => { this.typeGlyph() }, null, this)

    }


    //control functions
    setFast(_b) {
        this.goingFast = _b
    }
    setSpacesSkippable(_b) {
        this.skipSpaces = _b
    }
    append_text_auto_type(the_text) {
        this.full_text += the_text
        this.startTyping()
    }
    append_text(the_text) {
        this.full_text += the_text
    }
}



function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}
// from https://plainenglish.io/blog/check-if-string-is-alphanumeric-in-javascript

function isntWhitespace(str) {
    return /[^\s]/.test(str)
}