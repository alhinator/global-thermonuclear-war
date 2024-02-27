class Loading extends Phaser.Scene {
    constructor(){
        super("LoadingScene")
    }

    preload(){
        //console.log('in Loading preload')
       
    }

    create(){

    }

    init(){

        this.time.delayedCall(1000, () => {this.scene.start('mainMenuScene')})
    }

}