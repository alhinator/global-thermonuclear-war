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
        if (this.targetsChosen >= 6) {
            console.log("ready to move on from initial targets")
            //should make the enemy select initial targets as well.
        }
    }
    submit(scene, mgr){
        let input = scene.mainConsole.getInputString()
        let tg
        console.log("submit input from firstTarget:" + input)
        if(input === ""){return}
        if (mgr.myInitialTargets[input]){ //we have already chosen this target as part of initial select.
            scene.mainConsole.clearUserInput()
                panel_print_called(scene, mgr, scene.infoPanel, alreadySelectedInitialText)
        }
        let me = mgr.team == 1 ? mgr.USA : mgr.USSR
        let them = mgr.team == 1 ? mgr.USSR : mgr.USA 

        if (me.getTargetByName(input)){ //selected our own target.
            scene.mainConsole.clearUserInput()
            panel_print_called(scene, mgr, scene.infoPanel, selectedSelfTargetText)
        }
        else if( (tg = them.getTargetByName(input)) != false) { //selected GOOD RUSSIAN TARGET
            this.targetsChosen ++
            //now, add the "good" target to the active list.
            mgr.myInitialTargets[tg.name] = tg
            console.log(mgr.myInitialTargets)
            //now some console magic. it turns the previous input into part of the textbox now that it's submitted.
            //also clears the infopanel.
            panel_clear_called(scene, mgr, scene.infoPanel)
            scene.mainConsole.lockInput()
            let tt = scene.mainConsole.text
            if (scene.mainConsole.hasBufferChar) { tt = tt.slice(0,-1)}
            tt += '\n\n'
            panel_clear_called(scene, mgr, scene.mainConsole)
            panel_print_called(scene, mgr, scene.mainConsole, tt)
            scene.mainConsole.finishTyping()
            scene.mainConsole.unlockInput()


        } 
        else if (parseOtherCommands(scene, mgr, input) != -1){ scene.mainConsole.clearUserInput()}
        else { //does not ping either side OR is a command.
            scene.mainConsole.clearUserInput()
            panel_print_called(scene, mgr, scene.infoPanel, basicBadTargetText)
        }
        

    }
}
