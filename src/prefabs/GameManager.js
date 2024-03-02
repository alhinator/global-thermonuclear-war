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
    ct.addVehicle("ELLSWORTH", "ICBM", ["Colorado Springs"], 6, "ALL")
    ct.addVehicle("GRAND FORKS", "ICBM", ["Colorado Springs"], 6, "ALL")
    ct.addVehicle("FT WARREN", "ICBM", ["Colorado Springs"], 6, "ALL")

    //now by region for jets and subs.
    ct.addVehicle("ALAMEDA", "JET", ["Los Angeles", "San Diego"], 10, ["RU_URALS", "RU_SIBERIA", "RU_ASIA"])
    ct.addVehicle("SAN DIEGO", "SUB", ["San Diego", "Los Angeles"], 12, ["RU_SIBERIA", "RU_ASIA"])

    ct.addVehicle("NORFOLK", "SUB", ["Charlotte", "Washington DC"], 16, ["EU_EAST"])

    ct.addVehicle("LAKEHURST", "JET", ["New York", "Boston"], 16, ["EU_EAST", "RU_WEST", "RU_URALS"])

    ct.addVehicle("PEARL HARBOR", "SUB", ["Honolulu"], 16, ["RU_ASIA", "RU_SIBERIA"])

}


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
    ct.addTarget("MINSK", 1607100)
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

function launchHelper(scene, mgr, self, enemy, target, vehicle, strength, initial = false){

}