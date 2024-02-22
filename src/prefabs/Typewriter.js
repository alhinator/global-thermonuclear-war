class Typewriter extends Phaser.GameObjects.BitmapText{
    constructor(scene, x, y, font, _full_text, _speed, size, align){
        this.full_text = full_text
        super(scene, x, y, font, "", size, align)
        scene.add.existing(this)

        // the states of a typewriter: initial, typing, done
        this.state = "initial"

        this.speed = _speed
        this.fastSpeed = _speed / 2
        this.goingFast = false

        this.typeIndex = 0
    }

    startTyping(){
        if(this.state != "initial"){
            return
        }
        this.state = "typing"
        this.typeGlyph()
    }

    setFast(_f){
        this.goingFast = _f
    }

    typeGlyph(){
        //add the next index 
        this.text += this.full_text[this.typeIndex]
        this.typeIndex++

        if (this.typeIndex > this.full_text.length()){
            this.state = "done"
            return
        }
        delay = this.goingFast ? this.fastSpeed : this.speed
        this.scene.time.delayedCall(delay, ()=>{this.typeGlyph}, null, this)

    }
}