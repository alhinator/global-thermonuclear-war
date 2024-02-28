class InitialState extends State{
    enter(scene, mgr){
        scene.map.startTyping()
        console.log("end initialstate enter")

        //SKIP MAP THANG
        scene.map.finishTyping()
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
        let input = scene.mainConsole.getInputString()
        console.log(input)
        if(input === ""){return}
        if(input === "1" || input == "UNITED STATES") {mgr.team = 1; mgr.FSM.transition('FirstTarget')}
        else if(input === "2" || input == "SOVIET UNION") {mgr.team = 2 ; mgr.FSM.transition('FirstTarget')}
        else if (parseOtherCommands(scene, mgr, input) != -1){ scene.mainConsole.clearUserInput()}
        else  {
            scene.mainConsole.lockInput()
            scene.mainConsole.clearText()
            scene.mainConsole.append_text(basicBadInputText)
            scene.mainConsole.append_text_auto_type(whichSideText)
        }
    }
}

class FirstTarget extends State {
    enter(scene, mgr){
        scene.mainConsole.clearText()
        scene.mainConsole.lockInput()
        scene.mainConsole.append_text_auto_type(firstStrikeText)
    }
    execute(scene, mgr){
        if(!scene.mainConsole.allowInput && scene.mainConsole.state == "done") { //once done typing, allow input
            scene.mainConsole.unlockInput()
        }
    }
    submit(scene, mgr){
        let input = scene.mainConsole.getInputString()
        console.log("submit input from firstTarget:" + input)
        if(input === ""){return}
        //if() {} if target is GOOD
        //else if() {} terget is BAD
        else if (parseOtherCommands(scene, mgr, input) != -1){ scene.mainConsole.clearUserInput()}
        else  {
            scene.mainConsole.lockInput()
            scene.mainConsole.clearText()
            scene.mainConsole.append_text(basicBadInputText)
            scene.mainConsole.append_text_auto_type(firstStrikeText)
        }

    }
}
