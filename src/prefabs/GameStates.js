class InitialState extends State {
    enter(scene, mgr) {
        scene.map.startTyping()
        console.log("end initialstate enter")

        //SKIP MAP THANG
        //scene.map.finishTyping()
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
        //else if (input === "0" || input == "AUTOMATE") {mgr.team = 1; mgr.fullyAutomate = true; mgr.FSM.transition('FirstTarget')}
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
        panel_print_called(scene, mgr, scene.infoPanel, helpFirstStrikeText)
        scene.infoPanel.finishTyping()
        this.targetsChosen = 0
    }
    execute(scene, mgr) {
        if (!scene.mainConsole.allowInput && scene.mainConsole.state == "done") { //once done typing, allow input
            scene.mainConsole.unlockInput()
        }
        if (this.targetsChosen >= 2) {
            //console.log("ready to move on from initial targets")
            //should make the enemy select initial targets as well.
            //console.log(mgr.myInitialTargets)
            mgr.enemyInitialTargets = chooseEnemyTargets(scene, mgr, true)
            //console.log(mgr.enemyInitialTargets)

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
            do_panel_magic(scene, mgr, '\n\n')


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
        this.state = null
        this.activeSource = null
        this.activeDest = null
        this.activePayload = null

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
            panel_clear_called(scene, mgr, scene.mainConsole)
            scene.mainConsole.lockInput()
            panel_print_called(scene, mgr, scene.mainConsole, launchText1)
            this.state = "source"
            let me = mgr.team == 1 ? mgr.USA : mgr.USSR
            let them = mgr.team == 1 ? mgr.USSR : mgr.USA
            panel_print_called(scene, mgr, scene.infoPanel, me.getVehicles())
            scene.infoPanel.finishTyping()
        }

    }
    execute(scene, mgr) {
        if (scene.mainConsole.state == "done") { scene.mainConsole.unlockInput() }

    }
    submit(scene, mgr) {
        let input = scene.mainConsole.getInputString()
        if (input === "" || this.state == null) { return }
        if (input == "BACK") { mgr.FSM.transition("ViewMode") }
        else if (parseOtherCommands(scene, mgr, input) != -1) { scene.mainConsole.clearUserInput() }
        else {
            let me = mgr.team == 1 ? mgr.USA : mgr.USSR
            let them = mgr.team == 1 ? mgr.USSR : mgr.USA
            let src, dest, payload
            switch (this.state) {
                case "source": //we need to verify the user has input a valid source.
                    
                    if ((src = me.getVehicleByName(input)) == false) {
                        //bad vehicle.
                        panel_print_called(scene, mgr, scene.infoPanel, basicBadVehicleText)
                        scene.mainConsole.clearUserInput()
                    } else if (src.verifyDepend() == false) { // vehicle is incapacitated.
                        panel_print_called(scene, mgr, scene.infoPanel, "THIS VEHICLE IS INCAPACITATED.")
                        scene.mainConsole.clearUserInput()
                    } else if (src.capacity <= 0) { //vehicle has no more nukes
                        panel_print_called(scene, mgr, scene.infoPanel, "THIS VEHICLE HAS NO REMAINING PAYLOADS.")
                        scene.mainConsole.clearUserInput()
                    } else { // good SOURCE INPUT
                        this.activeSource = src
                        this.state = "dest"
                        do_panel_magic(scene, mgr, `\n\nZONES IN RANGE:\n${this.activeSource.zones}${launchText2}`)
                        panel_print_called(scene, mgr, scene.infoPanel, them.getTargets())
                        scene.infoPanel.finishTyping()
                    }
                    break
                case "dest":
                    //console.log(this.activeSource)
                    
                    if ((dest = them.getTargetByName(input)) == false) {
                        //bad target.
                        panel_print_called(scene, mgr, scene.infoPanel, basicBadTargetText)
                        scene.mainConsole.clearUserInput()
                    } else if (me.getTargetByName(input)) { //selected our own target.
                        scene.mainConsole.clearUserInput()
                        panel_print_called(scene, mgr, scene.infoPanel, selectedSelfTargetText)
                    } else if (this.activeSource.verifyZone(dest.zone) == false) { //dest is not inside src zone
                        scene.mainConsole.clearUserInput()
                        panel_print_called(scene, mgr, scene.infoPanel, "DESTINATION NOT INSIDE DELIVERY RANGE.")
                    } else { // good DEST   INPUT
                        this.activeDest = dest
                        this.state = "payload"
                        do_panel_magic(scene, mgr, `\n\nCAPACITY: ${this.activeSource.capacity}${launchText3}`)
                    }
                    break
                case "payload":
                    payload = parseInt(input)
                    if (payload != NaN && payload > 0 && payload <= this.activeSource.capacity) {
                        //good payload. we now have all three components needed to launch.
                        this.activePayload = payload //technically unnecessary, but good for consistancy.
                        launchHelper(scene, mgr, this.activeDest, this.activeSource, this.activePayload)
                        mgr.startTimer()
                        mgr.FSM.transition("ViewMode")
                    } else { // bad payload
                        panel_print_called(scene, mgr, scene.infoPanel, basicBadPayloadText)
                        scene.mainConsole.clearUserInput()
                    }
                    break
                default:
                    console.log("how did we get here? launchMode submit, default")
                    break
            }
        }


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
        else if (input === "LAUNCH") { mgr.FSM.transition("LaunchMode") }
        else if (parseOtherCommands(scene, mgr, input) != -1) { scene.mainConsole.clearUserInput() }
        else { //is not valid command.
            scene.mainConsole.clearUserInput()
            panel_print_called(scene, mgr, scene.infoPanel, basicBadInputText)
        }

    }
}