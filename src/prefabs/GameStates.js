class InitialState extends State{
    enter(scene, mgr){
        scene.map.startTyping()
        console.log("end initialstate enter")

        //SKIP MAP THANG
        //scene.map.finishTyping()
    }
    execute(scene, mgr){

    }
}

class SideSelect extends State {
    enter(scene, mgr){
        scene.mainConsole.startBufferOscillation() //start typing
        scene.mainConsole.startTyping()
    }
    execute(scene, mgr){
        if(!scene.mainConsole.allowInput && scene.mainConsole.state == "done") { //once done typing, allow input
            scene.mainConsole.unlockInput()
        }
    }
    submit(scene, mgr){
        let team = scene.mainConsole.getInputString()
        console.log(team)
        if(team === ""){return}
        if(team === "1" || team == "UNITED STATES") {mgr.team = 1}
        else if(team === "2" || team == "SOVIET UNION") {mgr.team = 2}
        else if (team === "HELP") {helpCalled(scene, mgr)}
        else {
            scene.mainConsole.lockInput()
            scene.mainConsole.clearText()
            scene.mainConsole.append_text("\n BAD INPUT. PLEASE TRY AGAIN. ")
            scene.mainConsole.append_text_auto_type(whichSideText)
        }
    }
}
