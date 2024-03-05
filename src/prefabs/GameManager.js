/*my notes on the 'gamification' of a cold-war nuclear simulator

    my intentions are not to build an entirely accurate simulation, rather, one that is more fun in nature while still
    keeping the original moral "fable" of the only way to win is not to play.
    however, for the sake of gamifying and allowing the player different strategies in order to 'win', 
    the two sides sort of follow this guide, which is loosely based off my research but not completely historically accurate.

    the united states has less overall citizens, but they are better protected by superior air defense.

    the USA is generally more "balanced" in terms of its options, however ,its power comes from localized command centers,
    that, if disabled, cause the player to lose access to their weapons.
    ex:   the united states loses all of its icbms if it loses NORAD in colorado.
    additionally, most of its submarine power comes from pearl harbor & california.
  
    the soviet union relies heavily on decentralized icbm's and submarines. 
    they contain less individual power on their own, but taking out one base or vehicle has minimal impact.
    additionaly, while city populations may SEEM larger, more citizens are killed during nuclear strikes
    due to high urban crowding and overpopulation.

    the united states also has slightly more missiles.
*/

class GameManager {
    constructor(scene){
        this.scene = scene

        this.FSM = new StateMachine('Initial', {
            Initial: new InitialState(),
            SideSelect: new SideSelect(),
            FirstTarget: new FirstTarget(),
            LaunchMode: new LaunchMode(),
            ViewMode: new ViewMode(),
        }, [scene, this])

        this.team = -1

        this.USA = new Country("UNITED STATES", scene)
        this.USSR = new Country("SOVIET UNION", scene)
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

    incTimer(delta){
        if(this.timerActive == false ) { return}
        this.gameRawTime += delta
        this.gameTime = timeToGameClock(this.gameRawTime)
    }

    startTimer(){
        this.timerActive = true
    }
    stopTimer(){
        this.timerActive = false
    }

    createMissile(target, strength){ //target should be a pointer to a target instance.
        console.log("in create missile for " + target.name)
        //first, check to see if target already has smth aimed at it.
        let missileKey = target.name

        while (this.activeMissiles[missileKey] != null) {missileKey += "x"} //avoid dupe names.
        let mDir = target.x < width/5 || target.x > width/2 ? missileDrawTextRight : missileDrawTextLeft
        let xOffset = mDir == missileDrawTextLeft ? 135 : 137
        this.activeMissiles[missileKey] = new Typewriter(this.scene, target.x - xOffset, target.y - 85, "wgfont", mDir,10, 16, "left")
        //this.activeMissiles[missileKey].setOrigin(0.5,1) weird behavior w textbox
        this.activeMissiles[missileKey].setTint(0xff0000).setDepth(5)
        //set callback function:
        this.activeMissiles[missileKey].onFinish = function () {target.bombLanded(strength) ; this.scene.time.delayedCall(1500, ()=>{this.destroy()}, null,this) }
        //and start with a random delay.
        this.scene.time.delayedCall(Phaser.Math.Between(10, 500), ()=>{
            this.activeMissiles[missileKey].startTypingWithoutGlow()
        }, [missileKey],this)

    }
}

function parseOtherCommands(scene, mgr, input, target = scene.infoPanel){
    //look for "name-based" commands first.
    if(input.slice(0, 4) === "VIEW") { 
        panel_print_called(scene, mgr, target, getViewRequest(mgr, input.slice(5)))
        return
    }
    if(input.slice(0, 4) === "INFO") { 
        panel_print_called(scene, mgr, target, getInfoRequest(mgr, input.slice(5)))
        return
    }

    switch(input){
        case "HELP": 
            panel_print_called(scene, mgr, target, helpText)
            break;
        case "HELP GAMES":
            panel_print_called(scene, mgr, target, helpGamesText)
            break;
        case "LIST GAMES":
            panel_print_called(scene, mgr, target, listGamesText)
            break;
        case "HELP FIRSTSTRIKE":
            panel_print_called(scene, mgr, target, helpFirstStrikeText)
            break;
        case "HELP LAUNCH":
            panel_print_called(scene, mgr, target, helpLaunchText)
            break;
        case "CLEAR":
            panel_clear_called(scene, mgr, target)
            break;
        case "EXIT":
            game_exit_called(scene, mgr)
        case "LIST 1":
        case "LIST UNITED STATES":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USA.getTargets())
            break;
        case "LIST 2":
        case "LIST SOVIET UNION":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USSR.getTargets())
            break;
        case "DEF 1":
        case "DEF UNITED STATES":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USA.getVehicles())
            break;
        case "DEF 2":
        case "DEF SOVIET UNION":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USSR.getVehicles())
            break;
        case "POP 1":
        case "POP UNITED STATES":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USA.getPopulationStats(mgr))
            break;
        case "POP 2":
        case "POP SOVIET UNION":
            panel_print_called(scene, mgr, scene.infoPanel, mgr.USSR.getPopulationStats(mgr))
            break;
        case "TOGGLE 1":
        case "TOGGLE UNITED STATES":
            mgr.USAVisOnMap = !mgr.USAVisOnMap
            for (const key in mgr.USA.targets) {
                mgr.USA.targets[key].setVisible(mgr.USAVisOnMap)
            }
            break;
        case "TOGGLE 2":
        case "TOGGLE SOVIET UNION":
            mgr.USSRVisOnMap = !mgr.USSRVisOnMap
            for (const key in mgr.USSR.targets) {
                mgr.USSR.targets[key].setVisible(mgr.USSRVisOnMap)
            }
            break;
        default:
            return -1
    }

}

function panel_print_called(scene, mgr, target, the_text){
    target.clearText()
    target.append_text_auto_type(the_text)
}
function panel_clear_called(scene, mgr, target){
    target.clearText()
}

function game_exit_called(scene, mgr){
    scene.scene.start("exitScene")
}

function getViewRequest(mgr, target){
    //steps: make query to both countries.
    //if neither return, she's false.
    //if one of them returns, return it.
    let a = mgr.USA.getTargetInfo(target, mgr)
    let b = mgr.USSR.getTargetInfo(target, mgr)
    //console.log(a)
    if (!a && !b) {return basicBadTargetText} 
    else if (a) { return a}
    else return b
}
function getInfoRequest(mgr, target){
    //steps: make query to both countries.
    //if neither return, she's false.
    //if one of them returns, return it.
    let a = mgr.USA.getVehicleInfo(target, mgr)
    let b = mgr.USSR.getVehicleInfo(target, mgr)
    //console.log(a)
    if (!a && !b) {return basicBadVehicleText} 
    else if (a) { return a}
    else return b
}

function populateUSACities(ct){ //gonna do 24,  and get a nice spread
    ct.addTarget("BALTIMORE", 786775, "US_EAST", 390, 145, 0.5)
    ct.addTarget("BOSTON", 562994,  "US_EAST", 435, 90, 0.4)
    ct.addTarget("CHARLOTTE", 314447, "US_SOUTH", 325, 170)
    ct.addTarget("CHICAGO", 3005072,  "US_MIDWEST", 355, 110)
    ct.addTarget("COLORADO SPRINGS", 215150, "US_CENTRAL", 170, 160, 0.5)
    ct.addTarget("DALLAS", 904078, "US_CENTRAL", 235, 215)
    ct.addTarget("DENVER", 492365, "US_CENTRAL", 170, 175, 0.4)
    ct.addTarget("DETROIT", 1203339, "US_MIDWEST", 375, 100)
    ct.addTarget("HOUSTON", 1595138, "US_CENTRAL", 240, 240, 0.5)
    ct.addTarget("HONOLULU", 584000, "US_WEST", 30, 275, 0.5)
    ct.addTarget("JACKSONVILLE", 540920, "US_SOUTH", 365, 215)
    ct.addTarget("LAS VEGAS", 164674, "US_WEST", 95, 165)
    ct.addTarget("LOS ANGELES", 2966850, "US_WEST", 60, 180, 0.4)
    ct.addTarget("MIAMI", 346865, "US_SOUTH", 370, 250, 0.5)
    ct.addTarget("MINNEAPOLIS", 370951, "US_MIDWEST", 335, 80)
    ct.addTarget("NEW ORLEANS", 557515, "US_SOUTH", 310, 230)
    ct.addTarget("NEW YORK", 7071639, "US_EAST", 410, 115)
    ct.addTarget("PHILADELPHIA", 1688210, "US_EAST", 405, 120)
    ct.addTarget("PHOENIX", 789704, "US_CENTRAL", 120, 185)
    ct.addTarget("PORTLAND", 366383, "US_WEST", 60, 85)
    ct.addTarget("SAN DIEGO", 875538, "US_WEST", 70, 195, 0.4)
    ct.addTarget("SAN FRANCISCO", 678974, "US_WEST", 40, 150)
    ct.addTarget("SEATTLE", 493846, "US_WEST", 65, 70)
    ct.addTarget("WASHINGTON DC", 638333, "US_EAST", 400, 135, 0.6)

    //console.log("in populateusacities")
    //console.log(ct.getTargets())
    //ct.targets["SEATTLE"].setDestroyed(true)
}

function populateUSAMilitary(ct){
    //icbm's first
    ct.addVehicle("ELLSWORTH", "ICBM", ["COLORADO SPRINGS"], 6, "ALL")
    ct.addVehicle("GRAND FORKS", "ICBM", ["COLORADO SPRINGS"], 6, "ALL")
    ct.addVehicle("FT WARREN", "ICBM", ["COLORADO SPRINGS"], 6, "ALL")

    //now by region for jets and subs.
    ct.addVehicle("ALAMEDA", "JET", ["LOS ANGELES", "SAN DIEGO"], 10, ["RU_URALS", "RU_SIBERIA", "RU_ASIA"])
    ct.addVehicle("SAN DIEGO", "SUB", ["SAN DIEGO", "LOS ANGELES"], 12, ["RU_SIBERIA", "RU_ASIA"])

    ct.addVehicle("NORFOLK", "SUB", ["CHARLOTTE", "WAHINGTON DC"], 10, ["RU_SOUTH", "RU_WEST"])
    ct.addVehicle("CHARLESTON", "JET", ["CHARLOTTE", "WASHINGTON DC"], 8, ["RU_SOUTH", "RU_WEST", "RU_URALS"])

    ct.addVehicle("LAKEHURST", "JET", ["NEW YORK", "BOSTON"], 16, ["RU_SOUTH", "RU_WEST", "RU_URALS"])

    ct.addVehicle("PEARL HARBOR", "SUB", ["HONOLULU"], 16, ["RU_SIBERIA", "RU_ASIA"])

}
//info from https://en.wikipedia.org/wiki/United_States_Navy_submarine_bases 
// and https://en.wikipedia.org/wiki/List_of_United_States_Air_Force_installations

//United States population data retrieved from https://en.wikipedia.org/wiki/1980_United_States_census#City_rankings
//Soviet Union population data retrieved from https://sashamaps.net/docs/maps/biggest-soviet-cities/
function populateUSSRCities(ct){
    ct.addTarget("ALMA ATA", 1127884, "RU_SOUTH", 695, 275)
    ct.addTarget("BAKU", 1795000, "RU_SOUTH", 600, 260)
    ct.addTarget("CHELYABINSK", 1107000, "RU_URALS", 650, 175)
    ct.addTarget("DNEPROPETROVSK", 1177897, "RU_SOUTH", 570, 210)
    ct.addTarget("DONETSK", 1109102, "RU_SOUTH", 585, 215)
    ct.addTarget("GORKY", 1438000, "RU_WEST", 605, 160)
    ct.addTarget("KAZAN", 1094000, "RU_WEST", 615, 165)
    ct.addTarget("KHARKOV", 1609959, "RU_SOUTH", 580, 195)
    ct.addTarget("KYIV", 2587945,"RU_SOUTH", 550, 200)
    ct.addTarget("KUYBYSHEV", 1254000, "RU_WEST", 620, 190)
    ct.addTarget("LENINGRAD", 5024000, "RU_WEST", 585, 120, 0.4)
    ct.addTarget("MURMANSK", 468000, "RU_WEST", 580, 90, 0.5)
    ct.addTarget("MOSCOW", 8967000, "RU_WEST", 590, 150, 0.5)
    ct.addTarget("NOVOSIBIRSK", 1437000, "RU_SIBERIA", 710, 175)
    ct.addTarget("ODESSA", 1115371, "RU_SOUTH", 560, 230)
    ct.addTarget("OMSK", 1149000, "RU_URALS", 675, 180)
    ct.addTarget("PERM", 1091000, "RU_URALS", 640, 155)
    ct.addTarget("ROSTOV ON DON", 1019000, "RU_SOUTH", 590, 220)
    ct.addTarget("SVERDLOVSK", 1365000, "RU_URALS", 645, 170)
    ct.addTarget("TASHKENT", 2072459, "RU_SOUTH", 665, 290)
    ct.addTarget("TBILISI", 1259692, "RU_SOUTH", 630, 260)
    ct.addTarget("UFA", 1082000, "RU_URALS", 635, 200)
    ct.addTarget("VOLGOGRAD", 999000, "RU_WEST", 620, 230, 0.4)
    ct.addTarget("YEREVAN", 1201500, "RU_SOUTH", 645, 270)

    //ct.targets["ALMA-ATA"].setDestroyed(true) //debug print test
}

//INFO FROM nuke.fas.org/guide/russia/facility/icbm/icbm_1.gif 
function populateUSSRMilitary(ct){
    //icbms first, as usual
    ct.addVehicle("DERAZHNYA", "ICBM", ["LENINGRAD"], 5, "ALL")
    ct.addVehicle("PERVOMAYSK", "ICBM", ["MOSCOW"], 5, "ALL")
    ct.addVehicle("DOMBAROVSKIY", "ICBM", ["VOLGOGRAD"], 5, "ALL")
    ct.addVehicle("UZHUR", "ICBM", ["OMSK"], 5, "ALL")
    ct.addVehicle("GLADKAYA", "ICBM", ["NOVOSIBIRSK"], 5, "ALL")

    //now lets do subs.
    ct.addVehicle("LENINGRAD", "SUB", ["LENINGRAD"], 6, "US_EAST", "US_SOUTH")
    ct.addVehicle("ARKHANGELSK", "SUB", ["MURMANSK"], 2, "US_EAST", "US_SOUTH")

    ct.addVehicle("MURMANSK", "SUB", ["MURMANSK"], 4, "US_EAST", "US_SOUTH", "US_MIDWEST")
    ct.addVehicle("MAGADAN", "SUB", ["NONE"], 6, "US_WEST", "US_CENTRAL", "US_MIDWEST")
    ct.addVehicle("ROSTOV ON DON", "SUB", ["ROSTOV ON DON"], 3, "US_EAST")
    ct.addVehicle("CAM RANH BAY", "SUB", ["NONE"], 5, "US_WEST", "US_CENTRAL", "US_MIDWEST")

    //some jets
    ct.addVehicle("AFRIKANDA", "JET", ["MURMANSK", "MOSCOW", "LENINGRAD"], 8, "US_EAST", "US_SOUTH", "US_MIDWEST")
    ct.addVehicle("BEKETOVSK", "JET", ["VOLGOGRAD"], 4, "US_EAST", "US_SOUTH", "US_MIDWEST")
    ct.addVehicle("ARTSYZ", "JET", ["ODESSA"], 4, "US_EAST", "US_SOUTH", "US_MIDWEST")
    ct.addVehicle("UZYN", "JET", ["KYIV"], 4, "US_EAST", "US_SOUTH", "US_MIDWEST")
    ct.addVehicle("ARTEM", "JET", ["NONE"], 6, "US_WEST", "US_CENTRAL")
    



}


function chooseEnemyTargets(scene, mgr, initial = false){
    let me = mgr.team == 1 ? mgr.USA : mgr.USSR
    let them = mgr.team == 1 ? mgr.USSR : mgr.USA 
    let tg
    if(initial == true){ // get two unique random targets.
        let first = getRandKeyFromObj(me.targets)
        let second
        do{
        second = getRandKeyFromObj(me.targets)
        } while (second == first)
        tg = {}
        tg[first.name] = first
        tg[second.name] = second
        console.assert(first != second)
        return tg
    } else {
        //first, pick an available vehicle.
        //second, pick a city within that vehicle's available zones.
        //third, pick a strength less than or equal to half of the vehicle's remaining strength.

    }
}

function launchHelper(scene, mgr, target, vehicle, strength, initial = false){

}

//random object picking code taken & slightly edited from https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object 
function getRandKeyFromObj(obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};

function timeToGameClock(time){
    //converting milliseconds into days, hours, minutes, seconds
    //however, we are scaling up.
    //one second irl should equate to one minute ingame. OK SO THIS WAS THE OLD ATTEMPT BUT THE MATH EQUATES OT 
    // ABOUT LIKE THREE SECONDS IS A MINUTE. AND HONESTLY IT FEELS FINE  SO.. IM LEAVING THE BAD MATH.
    //this conversion can be calculated by: time divided by 1000 (ms -> s) * 60 (s to min, scale not convert)
    let ingame_time = Math.floor(time * 0.06) 
    
    // first, calculate days display. this is done by dividing ingame_seconds by 60 (min) div 60 (hr) div 24 (day) = 86400
    let ingame_days = Math.floor(ingame_time/86400)

    //second, calculate hours display. There should be a cap before it rolls over, so:
    //divide 60 (min) div 60(hr) % modulo 24.
    let ingame_hours = Math.floor(ingame_time/3600 % 24)

    //same logic for minutes.
    //div 60, mod 60
    let ingame_minutes = Math.floor(ingame_time/60 % 60)

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