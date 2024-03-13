/*my notes on the 'gamification' of a cold-war nuclear simulator

    my intentions are not to build an entirely accurate simulation, rather, one that is more fun in nature while still
    keeping the original moral "fable" of the only way to win is not to play.
    however, for the sake of gamifying and allowing the player different strategies in order to 'win', 
    the two sides sort of follow this guide, which is loosely based off my research but not completely historically accurate.

    the united states has less overall citizens, but they are better protected by superior air defense.

    the USA is generally more "balanced" in terms of its options, however ,its power comes from centralized command centers,
    that, if disabled, cause the player to lose access to their weapons.
    ex:   the united states loses all of its icbms if it loses NORAD and washington dc.
    additionally, most of its submarine power comes from pearl harbor.
  
    the soviet union relies heavily on decentralized icbm's and submarines. 
    they contain less individual power on their own, but taking out one base or vehicle has minimal impact.
    additionaly, while city populations may SEEM larger, more citizens are killed during nuclear strikes
    due to high urban crowding and overpopulation.

    the united states also has slightly more missiles, however, it really doesn't matter.
*/

class GameManager {
    constructor(scene) {
        this.scene = scene

        this.FSM = new StateMachine('Initial', {
            Initial: new InitialState(),
            SideSelect: new SideSelect(),
            FirstTarget: new FirstTarget(),
            LaunchMode: new LaunchMode(),
            ViewMode: new ViewMode(),
        }, [scene, this])

        this.team = -1

        this.fullyAutomated = false

        this.USA = new Country("UNITED STATES", scene, ["US_WEST", "US_CENTRAL", "US_MIDWEST", "US_EAST", "US_SOUTH"])
        this.USSR = new Country("SOVIET UNION", scene, ["RU_WEST", "RU_SOUTH", "RU_URALS", "RU_SIBERIA", "RU_ASIA"])
        populateUSACities(this.USA)
        populateUSSRCities(this.USSR)
        populateUSAMilitary(this.USA)
        populateUSSRMilitary(this.USSR)

        let USAVisOnMap = false
        let USSRVisOnMap = false

        this.gameTime = 0
        this.gameRawTime = 0
        this.timerActive = false

        this.myInitialTargets = {}
        this.enemyInitialTargets = {}


        this.activeMissiles = {}

    }

    incTimer(delta) {
        if (this.timerActive == false) { return }
        this.gameRawTime += delta
        this.gameTime = timeToGameClock(this.gameRawTime)
    }

    startTimer() {
        this.timerActive = true
    }
    stopTimer() {
        this.timerActive = false
    }

    createMissile(target, strength, skipDelay = false) { //target should be a pointer to a target instance.
        //console.log("in create missile for " + target.name)
        //first, check to see if target already has smth aimed at it.
        let missileKey = target.name

        while (this.activeMissiles[missileKey] != null) { missileKey += "x" } //avoid dupe names.
        let mDir = target.x < width / 5 || (target.x > width / 2 && target.x < width * 3 / 4) ? missileDrawTextRight : missileDrawTextLeft
        let xOffset = mDir == missileDrawTextLeft ? 135 : 137

        let payloadDelay = 100 * strength //the larger an attack is, the longer it takes to arm.
        if (skipDelay) { payloadDelay = 0 }
        this.scene.time.delayedCall(payloadDelay, () => {
            this.activeMissiles[missileKey] = new Typewriter(this.scene, target.x - xOffset, target.y - 85, "wgfont", mDir, 10, 16, "left")
            this.activeMissiles[missileKey].setTint(0xff0000).setDepth(5)
            //set callback function:
            this.activeMissiles[missileKey].onFinish = function () { target.bombLanded(strength); this.scene.time.delayedCall(1500, () => { this.destroy() }, null, this) }
            //and start with a random delay.
            this.scene.time.delayedCall(Phaser.Math.Between(10, 500), () => {
                this.activeMissiles[missileKey].startTypingWithoutGlow()
            }, [missileKey], this)
        }, null, this)


    }
}

function parseOtherCommands(scene, mgr, input, target = scene.infoPanel) {
    //look for "name-based" commands first.
    if (input.slice(0, 4) === "VIEW") {
        panel_print_called(scene, mgr, target, getViewRequest(mgr, input.slice(5)))
        target.finishTyping()
        return
    }
    if (input.slice(0, 4) === "INFO") {
        panel_print_called(scene, mgr, target, getInfoRequest(mgr, input.slice(5)))
        target.finishTyping()
        return
    }

    switch (input) {
        case "HELP":
            panel_print_called(scene, mgr, target, helpText)
            target.finishTyping()
            break;
        case "MANUAL":
            window.open('./WOPR System Operation Manual.pdf', '_blank')
            break;
        case "HELP GAMES":
            panel_print_called(scene, mgr, target, helpGamesText)
            break;
        case "LIST GAMES":
            panel_print_called(scene, mgr, target, listGamesText)
            break;
        case "HELP FIRSTSTRIKE":
        case "HELP FIRST STRIKE":
            panel_print_called(scene, mgr, target, helpFirstStrikeText)
            target.finishTyping()
            break;
        case "HELP LAUNCH":
            panel_print_called(scene, mgr, target, helpLaunchText)
            target.finishTyping()
            break;
        case "CLEAR":
            panel_clear_called(scene, mgr, target)
            break;
        case "PAUSE":
            if (!mgr.timerActive) {
                break
            }
            mgr.stopTimer()
            break;
        case "RESUME":
            if (mgr.timerActive || mgr.gameRawTime == 0) {
                break;
            }
            mgr.startTimer()
            break;
        case "EXIT":
            game_exit_called(scene, mgr)
        case "LIST 1":
        case "LIST UNITED STATES":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USA.getTargets())
            scene.infoPanel.finishTyping()
            break;
        case "LIST 2":
        case "LIST SOVIET UNION":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USSR.getTargets())
            scene.infoPanel.finishTyping()
            break;
        case "NUKES 1":
        case "NUKES UNITED STATES":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USA.getVehicles())
            scene.infoPanel.finishTyping()
            break;
        case "NUKES 2":
        case "NUKES SOVIET UNION":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USSR.getVehicles())
            scene.infoPanel.finishTyping()
            break;
        case "POP 1":
        case "POP UNITED STATES":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USA.getPopulationStats(mgr))
            scene.infoPanel.finishTyping()
            break;
        case "POP 2":
        case "POP SOVIET UNION":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USSR.getPopulationStats(mgr))
            scene.infoPanel.finishTyping()
            break;
        case "TOGGLE":
            mgr.USAVisOnMap = !mgr.USAVisOnMap
            for (const key in mgr.USA.targets) {
                mgr.USA.targets[key].setVisible(mgr.USAVisOnMap)
            }
            mgr.USSRVisOnMap = !mgr.USSRVisOnMap
            for (const key in mgr.USSR.targets) {
                mgr.USSR.targets[key].setVisible(mgr.USSRVisOnMap)
            }
            break;


        //grader stuff, remove after class
        // case "HELP GRADER":
        //     mgr.graderMode = true
        //     panel_print_called(scene, mgr, target, helpGraderText)
        //     target.finishTyping()
        //     break;
        // case "FORCE WIN 1":
        //     if (mgr.graderMode) { annihilate(scene, mgr, mgr.USSR); break }

        //     return -1;
        // case "FORCE WIN 2":
        //     if (mgr.graderMode) { annihilate(scene, mgr, mgr.USA); break }
        //     return -1;
        // case "FORCE DRAW":
        //     if (mgr.graderMode) { annihilate(scene, mgr, mgr.USA); annihilate(scene, mgr, mgr.USSR); break }
        //     return -1;
        // case "FORCE NUKES 1":
        //     if (mgr.graderMode) { rmvNukes(scene, mgr, mgr.USA); break }
        //     return -1;
        // case "FORCE NUKES 2":
        //     if (mgr.graderMode) { rmvNukes(scene, mgr, mgr.USSR); break }
        //     return -1;


        default:
            return -1
    }

}

function panel_print_called(scene, mgr, target, the_text) {
    target.clearText()
    target.append_text_auto_type(the_text)
}
function panel_clear_called(scene, mgr, target) {
    target.clearText()
}
function do_panel_magic(scene, mgr, buffer) {
    //now some console magic. it turns the previous input into part of the textbox now that it's submitted.
    //also clears the infopanel.
    panel_clear_called(scene, mgr, scene.infoPanel)
    scene.mainConsole.lockInput()
    let tt = scene.mainConsole.text
    if (scene.mainConsole.hasBufferChar) { tt = tt.slice(0, -1) }
    tt += buffer
    panel_clear_called(scene, mgr, scene.mainConsole)
    panel_print_called(scene, mgr, scene.mainConsole, tt)
    scene.mainConsole.finishTyping()
    scene.mainConsole.unlockInput()
}

function game_exit_called(scene, mgr) {
    scene.scene.start("exitScene")
}
function game_restart_called(scene, mgr) {
    //scene.scene.launch("resultsScene") //will be actual thing. placeholder rn
    scene.scene.start("exitScene")
}

function getViewRequest(mgr, target) {
    //steps: make query to both countries.
    //if neither return, she's false.
    //if one of them returns, return it.
    let a = mgr.USA.getTargetInfo(target, mgr)
    let b = mgr.USSR.getTargetInfo(target, mgr)
    //console.log(a)
    if (!a && !b) { return basicBadTargetText }
    else if (a) { mgr.USA.targets[target].viewMe(); return a }
    else { mgr.USSR.targets[target].viewMe(); return b }
}
function getInfoRequest(mgr, target) {
    //steps: make query to both countries.
    //if neither return, she's false.
    //if one of them returns, return it.
    let a = mgr.USA.getVehicleInfo(target, mgr)
    let b = mgr.USSR.getVehicleInfo(target, mgr)
    //console.log(a)
    if (!a && !b) { return basicBadVehicleText }
    else if (a) { return a }
    else return b
}

function populateUSACities(ct) { //gonna do 24,  and get a nice spread
    ct.addTarget("BALTIMORE", 786775, "US_EAST", 390, 145, 0.5)
    ct.addTarget("BOSTON", 562994, "US_EAST", 435, 90, 0.4)
    ct.addTarget("CHARLOTTE", 314447, "US_SOUTH", 325, 170, 0.4)
    ct.addTarget("CHICAGO", 3005072, "US_MIDWEST", 355, 110)
    ct.addTarget("COLORADO SPRINGS", 215150, "US_CENTRAL", 170, 160, 0.92, true)
    ct.addTarget("DALLAS", 904078, "US_CENTRAL", 235, 215)
    ct.addTarget("DENVER", 492365, "US_CENTRAL", 170, 175, 0.4)
    ct.addTarget("DETROIT", 1203339, "US_MIDWEST", 375, 100)
    ct.addTarget("HOUSTON", 1595138, "US_CENTRAL", 240, 240, 0.5)
    ct.addTarget("HONOLULU", 584000, "US_WEST", 30, 275, 0.75)
    ct.addTarget("JACKSONVILLE", 540920, "US_SOUTH", 365, 215)
    ct.addTarget("LAS VEGAS", 164674, "US_WEST", 95, 165)
    ct.addTarget("LOS ANGELES", 2966850, "US_WEST", 60, 180, 0.4)
    ct.addTarget("MIAMI", 346865, "US_SOUTH", 370, 250, 0.5)
    ct.addTarget("MINNEAPOLIS", 370951, "US_MIDWEST", 335, 80)
    ct.addTarget("NEW ORLEANS", 557515, "US_SOUTH", 310, 230)
    ct.addTarget("NEW YORK", 7071639, "US_EAST", 410, 115, 0.6)
    ct.addTarget("PHILADELPHIA", 1688210, "US_EAST", 405, 120)
    ct.addTarget("PHOENIX", 789704, "US_CENTRAL", 120, 185)
    ct.addTarget("PORTLAND", 366383, "US_WEST", 60, 85)
    ct.addTarget("SAN DIEGO", 875538, "US_WEST", 70, 195, 0.65)
    ct.addTarget("SAN FRANCISCO", 678974, "US_WEST", 40, 150)
    ct.addTarget("SEATTLE", 493846, "US_WEST", 65, 70)
    ct.addTarget("WASHINGTON DC", 638333, "US_EAST", 400, 135, 0.9)

    //console.log("in populateusacities")
    //console.log(ct.getTargets())

}

function populateUSAMilitary(ct) {
    //icbms first
    ct.addVehicle("ELLSWORTH", "ICBM", ["COLORADO SPRINGS", "WASHINGTON DC"], 90, ["ALL"])
    ct.addVehicle("GRAND FORKS", "ICBM", ["COLORADO SPRINGS", "WASHINGTON DC"], 90, ["ALL"])
    ct.addVehicle("FT WARREN", "ICBM", ["COLORADO SPRINGS", "WASHINGTON DC"], 90, ["ALL"])

    //now by region for jets and subs.
    ct.addVehicle("ALAMEDA", "JET", ["LOS ANGELES", "SAN DIEGO", "SAN FRANCISCO"], 100, ["RU_URALS", "RU_SIBERIA", "RU_ASIA"])
    ct.addVehicle("SAN DIEGO", "SUB", ["SAN DIEGO", "LOS ANGELES"], 120, ["RU_SIBERIA", "RU_ASIA"])

    ct.addVehicle("NORFOLK", "SUB", ["CHARLOTTE", "WAHINGTON DC"], 100, ["RU_SOUTH", "RU_WEST"])
    ct.addVehicle("CHARLESTON", "JET", ["CHARLOTTE", "WASHINGTON DC"], 80, ["RU_SOUTH", "RU_WEST", "RU_URALS"])

    ct.addVehicle("LAKEHURST", "JET", ["NEW YORK", "BOSTON", "PHILADELPHIA"], 160, ["RU_SOUTH", "RU_WEST", "RU_URALS"])

    ct.addVehicle("PEARL HARBOR", "SUB", ["HONOLULU"], 160, ["RU_SIBERIA", "RU_ASIA", "RU_URALS"])

}
//info from https://en.wikipedia.org/wiki/United_States_Navy_submarine_bases 
// and https://en.wikipedia.org/wiki/List_of_United_States_Air_Force_installations

//United States population data retrieved from https://en.wikipedia.org/wiki/1980_United_States_census#City_rankings
//Soviet Union population data retrieved from https://sashamaps.net/docs/maps/biggest-soviet-cities/
function populateUSSRCities(ct) {
    ct.addTarget("ALMA ATA", 1127884, "RU_SOUTH", 695, 275, 0.4)
    ct.addTarget("BAKU", 1795000, "RU_SOUTH", 600, 260)
    ct.addTarget("CHELYABINSK", 1107000, "RU_URALS", 650, 175)
    ct.addTarget("DNEPROPETROVSK", 1177897, "RU_SOUTH", 570, 210)
    ct.addTarget("KAZAN", 1094000, "RU_WEST", 615, 165)
    ct.addTarget("KHARKOV", 1609959, "RU_SOUTH", 580, 195)
    ct.addTarget("KIEV", 2587945, "RU_SOUTH", 550, 200, 0.6)
    ct.addTarget("LENINGRAD", 5024000, "RU_WEST", 585, 120, 0.6)

    ct.addTarget("MAGADAN", 63000, "RU_ASIA", 900, 200)

    ct.addTarget("MURMANSK", 468000, "RU_WEST", 580, 90, 0.5)
    ct.addTarget("MOSCOW", 8967000, "RU_WEST", 590, 150, 0.75)
    ct.addTarget("NOVOSIBIRSK", 1437000, "RU_SIBERIA", 710, 175)
    ct.addTarget("ODESSA", 1115371, "RU_SOUTH", 560, 230)
    ct.addTarget("OMSK", 1149000, "RU_URALS", 675, 180, 0.4)
    ct.addTarget("PERM", 1091000, "RU_URALS", 640, 155)
    ct.addTarget("ROSTOV ON DON", 1019000, "RU_SOUTH", 590, 220)
    ct.addTarget("SVERDLOVSK", 1365000, "RU_URALS", 645, 170)
    ct.addTarget("TASHKENT", 2072459, "RU_SOUTH", 665, 290)
    ct.addTarget("TBILISI", 1259692, "RU_SOUTH", 630, 260)
    ct.addTarget("UFA", 1082000, "RU_URALS", 635, 200)

    ct.addTarget("VLADIVOSTOK", 631000, "RU_ASIA", 805, 260)

    ct.addTarget("VOLGOGRAD", 999000, "RU_WEST", 620, 230, 0.4)

    ct.addTarget("YAKUTSK", 110000, "RU_SIBERIA", 825, 160)

    ct.addTarget("YEREVAN", 1201500, "RU_SOUTH", 645, 270)


}

//INFO FROM nuke.fas.org/guide/russia/facility/icbm/icbm_1.gif 
function populateUSSRMilitary(ct) {
    //icbms first, as usual
    ct.addVehicle("DERAZHNYA", "ICBM", ["LENINGRAD"], 50, ["ALL"])
    ct.addVehicle("PERVOMAYSK", "ICBM", ["MOSCOW"], 50, ["ALL"])
    ct.addVehicle("DOMBAROVSKIY", "ICBM", ["VOLGOGRAD"], 50, ["ALL"])
    ct.addVehicle("UZHUR", "ICBM", ["OMSK"], 50, ["ALL"])
    ct.addVehicle("GLADKAYA", "ICBM", ["NOVOSIBIRSK"], 50, ["ALL"])

    //now lets do subs.
    ct.addVehicle("LENINGRAD", "SUB", ["LENINGRAD"], 40, ["US_EAST", "US_SOUTH"])
    ct.addVehicle("ARKHANGELSK", "SUB", ["MURMANSK"], 20, ["US_EAST", "US_SOUTH"])

    ct.addVehicle("MURMANSK", "SUB", ["MURMANSK"], 50, ["US_EAST", "US_SOUTH", "US_MIDWEST"])
    ct.addVehicle("MAGADAN", "SUB", ["MAGADAN", "VLADIVOSTOK"], 50, ["US_WEST", "US_CENTRAL", "US_MIDWEST"])
    ct.addVehicle("ROSTOV ON DON", "SUB", ["ROSTOV ON DON"], 30, ["US_EAST"])
    ct.addVehicle("CAM RANH BAY", "SUB", ["NONE"], 50, ["US_WEST", "US_CENTRAL", "US_MIDWEST"])

    //some jets
    ct.addVehicle("AFRIKANDA", "JET", ["MURMANSK", "MOSCOW", "LENINGRAD"], 50, ["US_EAST", "US_SOUTH", "US_MIDWEST"])
    ct.addVehicle("BEKETOVSK", "JET", ["VOLGOGRAD"], 30, ["US_EAST", "US_SOUTH", "US_MIDWEST"])
    ct.addVehicle("ARTSYZ", "JET", ["ODESSA"], 30, ["US_EAST", "US_SOUTH", "US_MIDWEST"])
    ct.addVehicle("UZYN", "JET", ["KIEV"], 30, ["US_EAST", "US_SOUTH", "US_CENTRAL"])
    ct.addVehicle("SEMEY", "JET", ["ALMA ATA"], 30, ["US_EAST", "US_SOUTH", "US_CENTRAL"])





}

function enemyAttack(scene, mgr) {
    let tg = chooseEnemyTargets(scene, mgr, false)

}
function chooseEnemyTargets(scene, mgr, initial = false) {
    let me = mgr.team == 1 ? mgr.USA : mgr.USSR
    let them = mgr.team == 1 ? mgr.USSR : mgr.USA
    let tg
    if (initial == true) { // get two unique random targets.
        let first = getRandKeyFromObj(me.targets)
        let second
        do {
            second = getRandKeyFromObj(me.targets)
        } while (second == first)
        tg = {}
        tg[first.name] = first
        tg[second.name] = second
        console.assert(first != second)
        return tg
    } else {
        //random is too complex for my tiny brain. lol
        // doing it funky then.
        //going to go down from the top, and target the largest alive city available.

        for (const key in them.vehicles) {
            const src = them.vehicles[key];
            if (!src.verifyAll()) { continue } //if the src can't shoot, gonext
            let highest
            for (const kiki in me.targets) {
                const potential_dest = me.targets[kiki]
                if ((!highest || potential_dest.population > highest.population) && !potential_dest.getDestroyed() && src.verifyZone(potential_dest.zone)) {
                    highest = potential_dest
                }
            }
            if (highest != null) {
                //what we want to do here is optimize the ratio of missiles to air-defense.
                //if every missiles "removes" 0.01 of air defense, and the minimum threshold for air defense is 0.1,
                //but let's aim for 0.2
                //then:
                //formula:      (airDef - 0.2) = ideal defense reduction
                //              if ideal*100 > capacity then launch max
                //              else launch ideal*100

                //       however; aiming for 0.2 every time is inefficient. let's only launch 80%
                //          of the missiles we need.
                let ideal_reduction = highest.defense_rating - 0.2
                //console.log("ideal reduction:" + ideal_reduction)
                if (Math.ceil(ideal_reduction * 80) > src.capacity) { strength = src.capacity }
                else { strength = Math.ceil(ideal_reduction * 80) }

                launchHelper(scene, mgr, highest, src, strength, true)
                return
            }
            //else: if no viable target, continue.

        }
        //if we got here, enemy is unable to select a city.
        //do stuff


    }
}

function launchHelper(scene, mgr, target, vehicle, strength, enemy = false) {
    //console.log(`in launch helper! \n   ${target}\n     ${vehicle}\n    ${strength}`)

    //decrease capacity
    vehicle.capacity -= strength

    let randomFailureChance = Math.random()
    if (randomFailureChance > 0.99) {
        if (enemy) {
            panel_print_called(scene, mgr, scene.airspaceAlert, `ALERT: ENEMY ROCKET FAILURE.`)
        } else {
            panel_print_called(scene, mgr, scene.infoPanel,
                `ERROR: CRITICAL LAUNCH FAILURE ENCOUNTERED.
PAYLOAD FAILED TO DELIVER.`)
        }
        return
    } //lulw

    mgr.createMissile(target, strength)

    let tt
    if (enemy) {
        tt = `!! WARHEADS DETECTED IN AIRSPACE: ${target.name}!!`
        panel_print_called(scene, mgr, scene.airspaceAlert, tt)
    } else {
        tt = `LAUNCH SUCCESSFUL:
    PAYLOAD EN ROUTE FROM ${vehicle.name}
    TO ${target.name}`
        panel_print_called(scene, mgr, scene.infoPanel, tt)
    }

    if (!enemy) {
        computePlayerResponseTime(scene, mgr)
    }
}

//random object picking code taken & slightly edited from https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object 
function getRandKeyFromObj(obj) {
    var keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
}

function timeToGameClock(time) {
    //converting milliseconds into days, hours, minutes, seconds
    //however, we are scaling up.
    //one second irl should equate to one minute ingame. OK SO THIS WAS THE OLD ATTEMPT BUT THE MATH EQUATES OT 
    // ABOUT LIKE THREE SECONDS IS A MINUTE. AND HONESTLY IT FEELS FINE  SO.. IM LEAVING THE BAD MATH.
    //this conversion can be calculated by: time divided by 1000 (ms -> s) * 60 (s to min, scale not convert)
    let ingame_time = Math.floor(time * 0.06)

    // first, calculate days display. this is done by dividing ingame_seconds by 60 (min) div 60 (hr) div 24 (day) = 86400
    let ingame_days = Math.floor(ingame_time / 86400)

    //second, calculate hours display. There should be a cap before it rolls over, so:
    //divide 60 (min) div 60(hr) % modulo 24.
    let ingame_hours = Math.floor(ingame_time / 3600 % 24)

    //same logic for minutes.
    //div 60, mod 60
    let ingame_minutes = Math.floor(ingame_time / 60 % 60)

    //last, just mod for seconds.
    let ingame_seconds = ingame_time % 60

    let dPad = 0, hPad = 0, mPad = 0, sPad = ""
    ingame_days < 10 ? dPad = "0" : dPad = ""
    ingame_hours < 10 ? hPad = "0" : hPad = ""
    ingame_minutes < 10 ? mPad = "0" : mPad = ""
    ingame_seconds < 10 ? sPad = "0" : sPad = ""
    let retVal = `T+${dPad}${ingame_days}D:${hPad}${ingame_hours}H:${mPad}${ingame_minutes}M:${sPad}${ingame_seconds}S`

    return retVal
}

function tickAllCityPops(scene, mgr) {
    for (const key in mgr.USA.targets) {
        mgr.USA.targets[key].tickInjIrr()
    }
    for (const key in mgr.USSR.targets) {
        mgr.USSR.targets[key].tickInjIrr()
    }
}

function winCons(scene, mgr) {

    let me = mgr.team == 1 ? mgr.USA : mgr.USSR
    let them = mgr.team == 1 ? mgr.USSR : mgr.USA

    let myState = me.checkDestroyed(mgr)
    let enState = them.checkDestroyed(mgr)

    let tt = ""
    // 0 = ok , -1 = warn, 1 = dead
    /*out of our two returns, we have multiple cases: (we stan truth tables)
        top is self, left is  enemy

                ok        warn         dead        
        ok      nthg      warn s      win en
                            
        warn    warn en   lose bth    lose bth

        dead    win s     lose bth    lose bth
    */
    //trivial case first
    if (!scene.gameEndBool && (myState != 0 || enState != 0)) {
        // warnings now.
        if (!scene.alreadyWarnedMe && myState == -1 && !enState) {
            scene.mainConsole.lockInput()
            scene.alreadyWarnedMe = true
            panel_print_called(scene, mgr, scene.infoPanel, lossWarningText)
            scene.infoPanel.onFinish = function () {
                scene.mainConsole.unlockInput()
                scene.infoPanel.onFinish = function () { }
            }
        } else if (!scene.alreadyWarnedThem && !myState && enState == -1) {
            scene.mainConsole.lockInput()
            scene.alreadyWarnedThem = true
            panel_print_called(scene, mgr, scene.infoPanel, winWarningText)
            scene.infoPanel.onFinish = function () {
                scene.mainConsole.unlockInput()
                scene.infoPanel.onFinish = function () { }
            }
        }
        // now for global collapses.
        //logic: need to cover: -1 & -1, 1 & -1, -1 & 1, 1 & 1. ez claps
        else if (Math.abs(myState * enState) == 1) {

            makeGameOverPanel(scene, mgr, bothLossText, bothLossBig)

        } else if (myState == 0 && enState == 1) {//my win
            makeGameOverPanel(scene, mgr, myWinText, `WINNER: ${me.name}`)


        } else if (myState == 1 && enState == 0) {//their win
            makeGameOverPanel(scene, mgr, myLossText, `WINNER: ${them.name}`)
        }
    } else if (!scene.gameEndBool && (!me.checkLaunchable() || !them.checkLaunchable())) {
        //console.log("somone ran outta bombs")
        //now, need to check if missiles are gone.
        //we do this after death-checks so we can avoid conditions where i am missiless and dead, or they are missiless and dead.
        /* 
            table for when OUR SIDE runs out of missiles
            top is self, left is enemy
    
                    ok          warn
    
            ok&m    lose        lose
    
            ok&no   draw        draw
    
            warn    draw        draw
            
            table for when THEIR SIDE  runs out of missiles
            top is self, left is enemy. already checked if i dont have misiles so those cases are not needed
            
                    ok&m          warn 
    
            ok      wrncont       draw
    
            warn    wrncont       draw
            
        // 0 = ok , -1 = warn, 1 = dead
        */
        if (!me.checkLaunchable()) { // we have no more missiles
            //our loss cons: ok+ok&m , warn+ok&m
            if (enState == 0 && them.checkLaunchable()) {
                makeGameOverPanel(scene, mgr, myLossMissiles, `WINNER: ${them.name}`)
            } else {
                makeGameOverPanel(scene, mgr, myDrawMissiles, bothLossBig)
            }
        }
        else if (!them.checkLaunchable()) { //they have no more missiles
            //our "warn" cons: ok&m
            if (!scene.alreadyWarnedThemMissiles && myState == 0) { //can win
                scene.mainConsole.lockInput()
                scene.alreadyWarnedThemMissiles = true
                panel_print_called(scene, mgr, scene.infoPanel, theirWarnMissiles)
                scene.infoPanel.onFinish = function () {
                    scene.mainConsole.unlockInput()
                    scene.infoPanel.onFinish = function () { }
                }
            } else if ((myState == -1)) { //cant win -> force draw for simplicity
                makeGameOverPanel(scene, mgr, theirWarnMissilesDraw, bothLossBig)
            }
        }
    }




}

function makeGameOverPanel(scene, mgr, smol, big) {
    scene.gameEndBool = true
    panel_print_called(scene, mgr, scene.infoPanel, smol)
    panel_clear_called(scene, mgr, scene.mainConsole)
    scene.mainConsole.lockInput()
    mgr.stopTimer()
    scene.infoPanel.onFinish = function () {
        scene.time.delayedCall(5000, () => {
            scene.blankPanel = scene.add.rectangle(0, 0, width * 2, height * 2, 0x00000, 1)
            scene.blankPanel.setDepth(6)
            scene.bigGameOverText = new Typewriter(scene, width / 2, height / 2, "wgfont", big, 150, 72, 1)
            scene.bigGameOverText.setDepth(7)
            scene.bigGameOverText.setOrigin(0.5, 0.5)
            scene.bigGameOverText.startTypingWithoutGlow()
            scene.time.delayedCall(10000, () => { game_restart_called(scene, mgr) }, null, this)
        })
    }
}

function computePlayerResponseTime(scene, mgr) { //this is called whenever a player responds.
    //console.log("in player response time:")
    let newTime = mgr.gameRawTime - scene.timeSincePlayerResponse
    //console.log(newTime)
    scene.timeSincePlayerResponse = mgr.gameRawTime
    scene.playerResponseTimes.push(newTime)
    if (scene.playerResponseTimes.length > 5) {
        scene.playerResponseTimes.shift()
    }
    //averaging function from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce 
    let initialValue = 0;
    scene.playerResponseSlidingAverage = scene.playerResponseTimes.reduce(
        (accumulator, currentValue) => accumulator + currentValue, initialValue,) / scene.playerResponseTimes.length;

}

function computeEnemyAggroTimes(scene, mgr) {
    let base = scene.playerResponseSlidingAverage

    //math:  set the LOW END of random response time
    //minimum response time cannot exceed 80,000ms or be less than 10,000ms.
    //otherwise, low end response time is 3,000ms faster than the player's average response.
    scene.enemyAggroLow = base > 80000 ? 80000 : base < 4000 ? 1000 : base - 3000

    //the reason minimums are so low is to prevent "pause-spamming".
    //when a player launches missiles, the timer auto-starts again, which should allow the machine to 
    //get a chance to respond, if they are pause-spamming.

    //math: set the HIGH END of random response time
    //maximum response time cannot exceetd 120,000ms or be less than 3,000ms
    //otherwise, high end response is 3,000ms slower than the player's average response.

    scene.enemyAggroHigh = base > 120000 ? 120000 : base < 3000 ? 3000 : base + 3000

    /* visualization:


                   longest response                             
                if player has shortest time                    longest possible
                      3,000ms                                  ai response time.
     0ms ----------------------------------------------------- 120,000ms (2 minutes)
            1,000ms                    80,000ms                                         
            shortest possible           shortest response
            ai response time.           if player has longest time



    */

    //console.log(`en aggro times: ${scene.enemyAggroLow}, ${scene.enemyAggroHigh}`)
}

function annihilate(scene, mgr, country) {
    for (const key in country.targets) {
        let tg = country.targets[key]

        mgr.createMissile(tg, 100, true)
    }
}

function rmvNukes(scene, mgr, country) {
    for (const key in country.vehicles) {
        let veh = country.vehicles[key]

        veh.capacity = 0
    }
}