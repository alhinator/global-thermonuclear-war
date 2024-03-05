class InitialState extends State {
    enter(scene, mgr) {
        scene.map.startTyping()
        console.log("end initialstate enter")

        //SKIP MAP THANG
        scene.map.finishTyping()
    }
    execute(scene, mgr) {

    }
}

class SideSelect extends State {
    enter(scene, mgr) {
        scene.infoPanel.clearText()
        scene.mainConsole.startBufferOscillation() //start typing
        scene.mainConsole.startTyping()
    }
    execute(scene, mgr) {
        if (!scene.mainConsole.allowInput && scene.mainConsole.state == "done") { //once done typing, allow input
            scene.mainConsole.unlockInput()
        }
    }
    submit(scene, mgr) {
        let input = scene.mainConsole.getInputString()
        console.log(input)
        if (input === "") { return }
        if (input === "1" || input == "UNITED STATES") { mgr.team = 1; mgr.FSM.transition('FirstTarget') }
        else if (input === "2" || input == "SOVIET UNION") { mgr.team = 2; mgr.FSM.transition('FirstTarget') }
        else if (parseOtherCommands(scene, mgr, input) != -1) { scene.mainConsole.clearUserInput() }
        else {
            scene.mainConsole.clearUserInput()
            panel_print_called(scene, mgr, scene.infoPanel, basicBadInputText)
        }
    }
}

class FirstTarget extends State {
    enter(scene, mgr) {
        scene.mainConsole.clearText()
        scene.infoPanel.clearText()
        scene.mainConsole.lockInput()
        scene.mainConsole.append_text_auto_type(firstStrikeText)
        this.targetsChosen = 0
    }
    execute(scene, mgr) {
        if (!scene.mainConsole.allowInput && scene.mainConsole.state == "done") { //once done typing, allow input
            scene.mainConsole.unlockInput()
        }
        if (this.targetsChosen >= 2) {
            console.log("ready to move on from initial targets")
            //should make the enemy select initial targets as well.
            console.log(mgr.myInitialTargets)
            mgr.enemyInitialTargets = chooseEnemyTargets(scene, mgr, true)
            console.log(mgr.enemyInitialTargets)

            mgr.FSM.transition('LaunchMode')

        }
    }

    submit(scene, mgr) {
        let input = scene.mainConsole.getInputString()
        let tg
        let me = mgr.team == 1 ? mgr.USA : mgr.USSR
        let them = mgr.team == 1 ? mgr.USSR : mgr.USA
        console.log("submit input from firstTarget:" + input)
        if (input === "") { return }
        if (mgr.myInitialTargets[input]) { //we have already chosen this target as part of initial select.
            scene.mainConsole.clearUserInput()
            panel_print_called(scene, mgr, scene.infoPanel, alreadySelectedInitialText)
        }
        else if (me.getTargetByName(input)) { //selected our own target.
            scene.mainConsole.clearUserInput()
            panel_print_called(scene, mgr, scene.infoPanel, selectedSelfTargetText)
        }
        else if ((tg = them.getTargetByName(input)) != false) { //selected GOOD RUSSIAN TARGET
            this.targetsChosen++
            //now, add the "good" target to the active list.
            mgr.myInitialTargets[tg.name] = tg
            console.log(mgr.myInitialTargets)
            //now some console magic. it turns the previous input into part of the textbox now that it's submitted.
            //also clears the infopanel.
            panel_clear_called(scene, mgr, scene.infoPanel)
            scene.mainConsole.lockInput()
            let tt = scene.mainConsole.text
            if (scene.mainConsole.hasBufferChar) { tt = tt.slice(0, -1) }
            tt += '\n\n'
            panel_clear_called(scene, mgr, scene.mainConsole)
            panel_print_called(scene, mgr, scene.mainConsole, tt)
            scene.mainConsole.finishTyping()
            scene.mainConsole.unlockInput()


        }
        else if (parseOtherCommands(scene, mgr, input) != -1) { scene.mainConsole.clearUserInput() }
        else { //does not ping either side OR is a command.
            scene.mainConsole.clearUserInput()
            panel_print_called(scene, mgr, scene.infoPanel, basicBadTargetText)
        }


    }
}

//this state occurs as soon as a launch command is submitted.
//it launches the missiles and then goes back into view mode.
class LaunchMode extends State {
    enter(scene, mgr) {
        if (mgr.myInitialTargets != null) {      // we are in first strike mode.
            //first, clear main console. set infoPanel to "launching..."
            panel_clear_called(scene, mgr, scene.mainConsole)
            scene.mainConsole.lockInput()
            let tt = launchTextMe + "\n" +
                Object.keys(mgr.myInitialTargets) + "\n\n" +
                launchTextThem + "\n" +
                Object.keys(mgr.enemyInitialTargets)
            panel_print_called(scene, mgr, scene.infoPanel, tt)
            mgr.startTimer()
            for (const key in mgr.myInitialTargets) {
                let obj = mgr.myInitialTargets[key]
                mgr.createMissile(obj, 3)
            }
            for (const key in mgr.enemyInitialTargets) {
                let obj = mgr.enemyInitialTargets[key]
                mgr.createMissile(obj, 3)
            }
            mgr.myInitialTargets = null
            mgr.enemyInitialTargets = null
            mgr.FSM.transition('ViewMode')
        } 
        else { // we are NOT in first strike mode, therefore, need to verify launch calls.


        }

    }
    execute(scene, mgr) {

    }
    submit(scene, mgr) {

    }
}

class ViewMode extends State { //this is our neutral state.
    enter(scene, mgr) {
        scene.mainConsole.clearText()
        scene.mainConsole.unlockInput()
    }
    execute(scene, mgr) {

    }
    submit(scene, mgr) {
        let input = scene.mainConsole.getInputString()
        let tg
        console.log("submit input from viewmode:" + input)
        if (input === "") { return }
        else if (input === "LAUNCH") {/*go into regular launch mode */}
        else if (parseOtherCommands(scene, mgr, input) != -1) { scene.mainConsole.clearUserInput() }
        else { //is not valid command.
            scene.mainConsole.clearUserInput()
            panel_print_called(scene, mgr, scene.infoPanel, basicBadInputText)
        }

    }
}