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
        scene.infoPanel.clearText()
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
            scene.mainConsole.clearUserInput()
            panel_print_called(scene, mgr, scene.infoPanel, basicBadInputText)
        }
    }
}

class FirstTarget extends State {
    enter(scene, mgr){
        scene.mainConsole.clearText()
        scene.infoPanel.clearText()
        scene.mainConsole.lockInput()
        scene.mainConsole.append_text_auto_type(firstStrikeText)
        this.targetsChosen = 0
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
        if(mgr.team == 1){ //we are united states, 
            if (mgr.USA.getTargetByName(input)){ //selected our own target.
                scene.mainConsole.clearUserInput()
                panel_print_called(scene, mgr, scene.infoPanel, selectedSelfTargetText)
            }
            else if(mgr.USSR.getTargetByName(input)) { //selected GOOD RUSSIAN TARGET
                this.targetsChosen ++
                //now, add the "good" target to the active list.

            } else { //does not ping either side.
                scene.mainConsole.clearUserInput()
                panel_print_called(scene, mgr, scene.infoPanel, basicBadTargetText)
            }

        }
        
        //else if() {} terget is BAD
        else if (parseOtherCommands(scene, mgr, input) != -1){ scene.mainConsole.clearUserInput()}
        else  {
            scene.mainConsole.clearUserInput()
            panel_print_called(scene, mgr, scene.infoPanel, basicBadInputText)
        }

    }
}
