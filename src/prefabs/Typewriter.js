class Typewriter extends Phaser.GameObjects.BitmapText{
    constructor(scene, x, y, font, _full_text, _speed = 50, size = 16, align = 'left'){
        super(scene, x, y, font, "", size, align)
        scene.add.existing(this)
        this.full_text = _full_text


        // the states of a typewriter: initial, typing, done
        this.state = "waiting"

        this.speed = _speed
        this.fastSpeed = _speed / 2
        this.goingFast = false

        this.typeIndex = 0
        this.isGlowing = false
    }

    startTyping(){
        if(this.state != "waiting"){
            return
        }
        this.activateGlow()
        this.state = "typing"
        this.typeGlyph()
    }

    activateGlow(){
        if(this.isGlowing){return}
        this.isGlowing = true
        this.postFX.addGlow(0x7797e0,1, 0.8, false, 0.1,20)
    }

    setFast(_f){
        this.goingFast = _f
    }

    typeGlyph(){
       //console.log(this.full_text)
        //add the next index 
        this.text += this.full_text[this.typeIndex]
        this.typeIndex++

        if (this.typeIndex == this.full_text.length){
            this.state = "done"
            console.log("done typing")
            return
        }
        let delay = this.goingFast ? this.fastSpeed : this.speed
        this.scene.time.delayedCall(delay, ()=>{this.typeGlyph()}, null, this)

    }

    append_text_auto_type(the_text) {
        this.full_text += the_text
        //this.state = "waiting"
        this.startTyping()
    }

    append_text(the_text){
        this.full_text += the_text
    }
}