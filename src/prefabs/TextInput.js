class TextInput extends Typewriter {
    constructor(scene, x, y, font, _full_text, _speed = 50, size = 16, align = 'left', _buff_char = '|') {
        super(scene, x, y, font, _full_text, _speed = 50, size = 16, align = 'left')
        this.allowInput = false
        this.hasBufferChar = false
        this.buffChar = _buff_char
        this.isBufferOscillating = false
        this.originalFTL = _full_text.length
        this.userInputString = ""
    }
    //command funcs
    lockInput() {
        this.allowInput = false
    }
    unlockInput() {
        this.allowInput = true
    }
    getInputString(){
        return this.userInputString
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
        if ( this.state == "done" || this.typeIndex >= this.full_text.length) {
            if (this.state != "done") { //short circut to prevent onFinish from getting called twice if finishtyping() is called
                this.state = "done"
                this.onFinish()
            }
            return
        }
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
            while (!isntWhitespace(charr) && this.typeIndex < this.full_text.length) {
                charr = this.full_text[this.typeIndex]
                if (this.hasBufferChar) {
                    this.text = this.text.slice(0, -1) + charr + this.buffChar
                } else {
                    this.text += charr
                }
                this.typeIndex++
            }
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
        this.userInputString = ""
        this.typeIndex = 0
        if (this.hasBufferChar) {
            this.text += this.buffChar
        }
    }
    backspace() {
        if (this.state != "done" || this.full_text.length <= this.originalFTL) { return } // don't want to backspace if we haven't finished typing the whole paragraph OR backspacing into the p

        this.full_text = this.full_text.slice(0, -1)
        if (this.hasBufferChar) {
            this.text = this.text.slice(0, -2) + this.buffChar
        } else {
            this.text = this.text.slice(0, -1)
        }
        this.userInputString = this.userInputString.slice(0,-1)
        this.typeIndex--
        this.scene.sound.play('kpshort', { loop: false, volume: 0.2 })
    }
    append_text_auto_type(the_text) {
        this.full_text += the_text
        this.originalFTL = this.full_text.length
        this.startTyping()
    }
    append_user_input(the_text) {
        //console.log("the_text:" + the_text)
        //if(the_text == `\s`){ console.log("trying to spacebar")}
        this.full_text += the_text
        this.userInputString += the_text
        this.startTyping()
    }

    handleInput(_context) { //basically, we take the keystroke from the outside source and convert it into a letter added/removed from the string.
        if(!this.allowInput) { return} //dont waste time if not allowed.
        //console.log("handling input")
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) { _context.userHitEnter()}
        if (Phaser.Input.Keyboard.JustDown(keyBACK)) { this.backspace()}
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) { this.append_user_input(` `)}

        if (Phaser.Input.Keyboard.JustDown(keyQ)) { this.append_user_input("Q") }
        if (Phaser.Input.Keyboard.JustDown(keyW)) { this.append_user_input("W") }
        if (Phaser.Input.Keyboard.JustDown(keyE)) { this.append_user_input("E") }
        if (Phaser.Input.Keyboard.JustDown(keyR)) { this.append_user_input("R") }
        if (Phaser.Input.Keyboard.JustDown(keyT)) { this.append_user_input("T") }
        if (Phaser.Input.Keyboard.JustDown(keyY)) { this.append_user_input("Y") }
        if (Phaser.Input.Keyboard.JustDown(keyU)) { this.append_user_input("U") }
        if (Phaser.Input.Keyboard.JustDown(keyI)) { this.append_user_input("I") }
        if (Phaser.Input.Keyboard.JustDown(keyO)) { this.append_user_input("O") }
        if (Phaser.Input.Keyboard.JustDown(keyP)) { this.append_user_input("P") }
        if (Phaser.Input.Keyboard.JustDown(keyA)) { this.append_user_input("A") }
        if (Phaser.Input.Keyboard.JustDown(keyS)) { this.append_user_input("S") }
        if (Phaser.Input.Keyboard.JustDown(keyD)) { this.append_user_input("D") }
        if (Phaser.Input.Keyboard.JustDown(keyF)) { this.append_user_input("F") }
        if (Phaser.Input.Keyboard.JustDown(keyG)) { this.append_user_input("G") }
        if (Phaser.Input.Keyboard.JustDown(keyH)) { this.append_user_input("H") }
        if (Phaser.Input.Keyboard.JustDown(keyJ)) { this.append_user_input("J") }
        if (Phaser.Input.Keyboard.JustDown(keyK)) { this.append_user_input("K") }
        if (Phaser.Input.Keyboard.JustDown(keyL)) { this.append_user_input("L") }
        if (Phaser.Input.Keyboard.JustDown(keyZ)) { this.append_user_input("Z") }
        if (Phaser.Input.Keyboard.JustDown(keyX)) { this.append_user_input("X") }
        if (Phaser.Input.Keyboard.JustDown(keyC)) { this.append_user_input("C") }
        if (Phaser.Input.Keyboard.JustDown(keyV)) { this.append_user_input("V") }
        if (Phaser.Input.Keyboard.JustDown(keyB)) { this.append_user_input("B") }
        if (Phaser.Input.Keyboard.JustDown(keyN)) { this.append_user_input("N") }
        if (Phaser.Input.Keyboard.JustDown(keyM)) { this.append_user_input("M") }
        if (Phaser.Input.Keyboard.JustDown(key1)) { this.append_user_input("1") }
        if (Phaser.Input.Keyboard.JustDown(key2)) { this.append_user_input("2") }
        if (Phaser.Input.Keyboard.JustDown(key3)) { this.append_user_input("3") }
        if (Phaser.Input.Keyboard.JustDown(key4)) { this.append_user_input("4") }
        if (Phaser.Input.Keyboard.JustDown(key5)) { this.append_user_input("5") }
        if (Phaser.Input.Keyboard.JustDown(key6)) { this.append_user_input("6") }
        if (Phaser.Input.Keyboard.JustDown(key7)) { this.append_user_input("7") }
        if (Phaser.Input.Keyboard.JustDown(key8)) { this.append_user_input("8") }
        if (Phaser.Input.Keyboard.JustDown(key9)) { this.append_user_input("9") }
        if (Phaser.Input.Keyboard.JustDown(key0)) { this.append_user_input("0") }


    }
}