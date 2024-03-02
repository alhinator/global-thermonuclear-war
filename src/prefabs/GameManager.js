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

        this.FSM = new StateMachine('Initial', {
            Initial: new InitialState(),
            SideSelect: new SideSelect(),
            FirstTarget: new FirstTarget(),
        }, [scene, this])

        this.team = -1

        this.USA = new Country("UNITED STATES")
        this.USSR = new Country("SOVIET UNION")
        populateUSACities(this.USA)
        populateUSSRCities(this.USSR)
        populateUSAMilitary(this.USA)
        populateUSSRMilitary(this.USSR)

        this.gameTime = 0

        this.myInitialTargets = {}
        this.enemyInitialTargets = {}

        this.myCurrentTargets = {}
        this.enemyCurrentTargets = {}
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
            panel_print_called(scene, mgr, target, firstStrikeHelpText)
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
    ct.addTarget("BALTIMORE", 786775, "US_EAST")
    ct.addTarget("BOSTON", 562994,  "US_EAST")
    ct.addTarget("CHARLOTTE", 314447, "US_SOUTH")
    ct.addTarget("CHICAGO", 3005072,  "US_EAST")
    ct.addTarget("COLORADO SPRINGS", 215150, "US_CENTRAL")
    ct.addTarget("DALLAS", 904078, "US_CENTRAL")
    ct.addTarget("DENVER", 492365, "US_CENTRAL")
    ct.addTarget("DETROIT", 1203339, "US_MIDWEST")
    ct.addTarget("HOUSTON", 1595138, "US_CENTRAL")
    ct.addTarget("HONOLULU", 584000, "US_WEST")
    ct.addTarget("JACKSONVILLE", 540920, "US_SOUTH")
    ct.addTarget("LAS VEGAS", 164674, "US_WEST")
    ct.addTarget("LOS ANGELES", 2966850, "US_WEST")
    ct.addTarget("MIAMI", 346865, "US_SOUTH")
    ct.addTarget("MINNEAPOLIS", 370951, "US_MIDWEST")
    ct.addTarget("NEW ORLEANS", 557515, "US_SOUTH")
    ct.addTarget("NEW YORK", 7071639, "US_EAST")
    ct.addTarget("PHILADELPHIA", 1688210, "US_EAST")
    ct.addTarget("PHOENIX", 789704, "US_CENTRAL")
    ct.addTarget("SACRAMENTO", 275741, "US_WEST")
    ct.addTarget("SAN DIEGO", 875538, "US_WEST")
    ct.addTarget("SAN FRANCISCO", 678974, "US_WEST")
    ct.addTarget("SEATTLE", 493846, "US_WEST")
    ct.addTarget("WASHINGTON DC", 638333, "US_EAST")

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

    ct.addVehicle("NORFOLK", "SUB", ["CHARLOTTE", "WAHINGTON DC"], 10, ["EU_EAST", "RU_WEST"])
    ct.addVehicle("CHARLESTON", "JET", ["CHARLOTTE", "WASHINGTON DC"], 8, ["EU_EAST", "RU_WEST", "RU_URALS"])

    ct.addVehicle("LAKEHURST", "JET", ["NEW YORK", "BOSTON"], 16, ["EU_EAST", "RU_WEST", "RU_URALS"])

    ct.addVehicle("PEARL HARBOR", "SUB", ["HONOLULU"], 16, ["RU_SIBERIA", "RU_ASIA"])

}
//info from https://en.wikipedia.org/wiki/United_States_Navy_submarine_bases 
// and https://en.wikipedia.org/wiki/List_of_United_States_Air_Force_installations

//United States population data retrieved from https://en.wikipedia.org/wiki/1980_United_States_census#City_rankings
//Soviet Union population data retrieved from https://sashamaps.net/docs/maps/biggest-soviet-cities/
function populateUSSRCities(ct){
    ct.addTarget("ALMA ATA", 1127884)
    ct.addTarget("BAKU", 1795000)
    ct.addTarget("CHELYABINSK", 1107000)
    ct.addTarget("DNEPROPETROVSK", 1177897)
    ct.addTarget("DONETSK", 1109102)
    ct.addTarget("GORKY", 1438000)
    ct.addTarget("KAZAN", 1094000)
    ct.addTarget("KHARKOV", 1609959)
    ct.addTarget("KYIV", 2587945)
    ct.addTarget("LUYBYSHEV", 1254000)
    ct.addTarget("LENINGRAD", 5024000)
    ct.addTarget("MURMANSK", 468000)
    ct.addTarget("MOSCOW", 8967000)
    ct.addTarget("NOVOSIBIRSK", 1437000)
    ct.addTarget("ODESSA", 1115371)
    ct.addTarget("OMSK", 1149000)
    ct.addTarget("PERM", 1091000)
    ct.addTarget("ROSTOV ON DON", 1019000)
    ct.addTarget("SVERDLOVSK", 1365000)
    ct.addTarget("TASHKENT", 2072459)
    ct.addTarget("TBILISI", 1259692)
    ct.addTarget("ULFA", 1082000)
    ct.addTarget("VOLGOGRAD", 999000)
    ct.addTarget("YEREVAN", 1201500)

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
        tg = []
        tg.push(first)
        tg.push(second)
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