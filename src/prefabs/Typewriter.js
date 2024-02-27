class Typewriter extends Phaser.GameObjects.BitmapText{
    constructor(scene, x, y, font, _full_text, _speed = 100, size = 16, align = 'left'){
        super(scene, x, y, font, "", size, align)
        scene.add.existing(this)
        this.full_text = _full_text


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
        console.log(this.full_text)
        //add the next index 
        this.text += this.full_text[this.typeIndex]
        this.typeIndex++

        if (this.typeIndex == this.full_text.length){
            this.state = "done"
            console.log("done")
            return
        }
        let delay = this.goingFast ? this.fastSpeed : this.speed
        console.log(delay)
        this.scene.time.delayedCall(delay, ()=>{this.typeGlyph()}, null, this)

    }
}