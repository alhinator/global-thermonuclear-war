class TextInput extends Typewriter {
    constructor(scene, x, y, font, _full_text, _speed = 50, size = 16, align = 'left', _buff_char = '|') {
        super(scene, x, y, font, _full_text, _speed = 50, size = 16, align = 'left')
        this.allowInput = true
        this.hasBufferChar = false
        this.buffChar = _buff_char
        this.isBufferOscillating = false
    }
    //command funcs
    lockInput() {
        this.allowInput = false
    }
    allowInput() {
        this.allowInput = true
    }
    startBufferOscillation() {
        if (this.isBufferOscillating) { return }
        this.bufferOscillation()
    }


    bufferOscillation() {
        if (this.hasBufferChar) { //if there is a buffer character at the end, take it off.
            this.text = this.text.slice(0, -1);
            this.hasBufferChar = false
        } else {
            this.text += this.buffChar
            this.hasBufferChar = true
        }
        this.scene.time.delayedCall(500, () => { this.bufferOscillation() }, null, this)
    }

    //overriding typeGlyph in order to account for endcap character
    typeGlyph() {
        //console.log(this.full_text)
        //add the next index 
        let charr = this.full_text[this.typeIndex]
        if (this.hasBufferChar) {
            this.text = this.text.slice(0, -1) + charr + this.buffChar
        } else {
            this.text += charr
        }
        this.typeIndex++
        if (isntWhitespace(charr)) {
            this.scene.sound.play('kpshort', { loop: false, volume: 0.2 })
        }


        if (this.skipSpaces && !isntWhitespace(charr)) {
            while (!isntWhitespace(charr)) {
                charr = this.full_text[this.typeIndex]
                if (this.hasBufferChar) {
                    this.text = this.text.slice(0, -1) + charr + this.buffChar
                } else {
                    this.text += charr
                }
                this.typeIndex++
            }
        }



        if (this.typeIndex >= this.full_text.length) {
            this.state = "done"
            this.onFinish()
            return
        }
        let delay = this.goingFast ? this.fastSpeed : this.speed
        this.scene.time.delayedCall(delay, () => { this.typeGlyph() }, null, this)

    }

    //same for finishtyping & cleartext
    finishTyping() {
        if (this.state != "typing") { return }

        this.state = "done"
        this.text = this.full_text
        if (this.hasBufferChar) {
            this.text += this.buffChar
        }
        this.onFinish()
    }
    clearText() {
        this.text = ""
        this.full_text = ""
        this.typeIndex = 0
        if (this.hasBufferChar) {
            this.text += this.buffChar
        }
    }
    backspace() {
        if (this.state != "done") { return } // don't want to backspace if we haven't finished typing the whole paragraph.

        this.full_text = this.full_text.slice(0, -1)
        if (this.hasBufferChar) {
            this.text = this.text.slice(0, -2) + this.buffChar
        } else {
            this.text = this.text.slice(0, -1)
        }
    }

    handleInput() { //basically, we take the keystroke from the outside source and convert it into a letter added/removed from the string.

    }

}