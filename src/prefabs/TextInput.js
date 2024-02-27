class TextInput extends Typewriter{
    constructor(scene, x, y, font, _full_text, _speed = 50, size = 16, align = 'left', _buff_char = '_'){
        super(scene, x, y, font, _full_text, _speed = 50, size = 16, align = 'left')
        this.allowInput = true
        this.hasBufferChar = false
        this.buffChar = _buff_char
        this.isBufferOscillating = false
    }
    //command funcs
    lockInput(){
        this.allowInput = false
    }
    allowInput(){
        this.allowInput = true
    }
    startBufferOscillation(){
        if(this.isBufferOscillating){return}
        this.bufferOscillation()
    }

    bufferOscillation(){
        if(this.hasBufferChar){ //if there is a buffer character at the end, take it off.
            this.text = this.text.slice(0, -1);
            this.hasBufferChar = false
        } else {
            this.text += this.buffChar
            this.hasBufferChar = true
        }
        this.scene.time.delayedCall(50, ()=>{this.bufferOscillation()}, null, this)
    }
    
    //overriding typeGlyph in order to account for endcap character
    typeGlyph(){
        //console.log(this.full_text)
         //add the next index 
         let charr = this.full_text[this.typeIndex]
         this.text += charr
         this.typeIndex++
         if(isAlphanumeric(charr)){
             this.scene.sound.play('kpshort',{loop:false, volume:0.2})
         }
 
         if (this.typeIndex == this.full_text.length){
             this.state = "done"
             console.log("done typing")
             return
         }
         let delay = this.goingFast ? this.fastSpeed : this.speed
         this.scene.time.delayedCall(delay, ()=>{this.typeGlyph()}, null, this)
 
     }

}