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
    }
}

function parseOtherCommands(scene, mgr, input, target = scene.infoPanel){
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

function populateUSACities(ct){ //gonna do 24,  and get a nice spread
    ct.addTarget("Baltimore", 786775)
    ct.addTarget("Boston", 562994)
    ct.addTarget("Charlotte", 314447)
    ct.addTarget("Chicago", 3005072)
    ct.addTarget("Colorado Springs", 215150)
    ct.addTarget("Dallas", 904078)
    ct.addTarget("Denver", 492365)
    ct.addTarget("Detroit", 1203339)
    ct.addTarget("Houston", 1595138)
    ct.addTarget("Jacksonville", 540920)
    ct.addTarget("Las Vegas", 164674)
    ct.addTarget("Los Angeles", 2966850)
    ct.addTarget("Miami", 346865)
    ct.addTarget("Minneapolis", 370951)
    ct.addTarget("New Orleans", 557515)
    ct.addTarget("New York", 7071639)
    ct.addTarget("Philadelphia", 1688210)
    ct.addTarget("Phoenix", 789704)
    ct.addTarget("Portland", 366383)
    ct.addTarget("Sacramento", 275741)
    ct.addTarget("San Diego", 875538)
    ct.addTarget("San Francisco", 678974)
    ct.addTarget("Seattle", 493846)
    ct.addTarget("Washington DC", 638333)

    //console.log("in populateusacities")
    //console.log(ct.getTargets())
}
//United States population data retrieved from https://en.wikipedia.org/wiki/1980_United_States_census#City_rankings
//Soviet Union population data retrieved from https://sashamaps.net/docs/maps/biggest-soviet-cities/
function populateUSSRCities(ct){
    ct.addTarget("Alma Ata", 1127884)
    ct.addTarget("Baku", 1795000)
    ct.addTarget("Chelyabinsk", 1107000)
    ct.addTarget("Dnepropetrovsk", 1177897)
    ct.addTarget("Donetsk", 1109102)
    ct.addTarget("Gorky", 1438000)
    ct.addTarget("Kazan", 1094000)
    ct.addTarget("Kharkov", 1609959)
    ct.addTarget("Kiev", 2587945)
    ct.addTarget("Kuybyshev", 1254000)
    ct.addTarget("Leningrad", 5024000)
    ct.addTarget("Minsk", 1607100)
    ct.addTarget("Moscow", 8967000)
    ct.addTarget("Novosibirsk", 1437000)
    ct.addTarget("Odessa", 1115371)
    ct.addTarget("Omsk", 1149000)
    ct.addTarget("Perm", 1091000)
    ct.addTarget("Rostov On Don", 1019000)
    ct.addTarget("Sverdlovsk", 1365000)
    ct.addTarget("Tashkent", 2072459)
    ct.addTarget("Tbilisi", 1259692)
    ct.addTarget("Ulfa", 1082000)
    ct.addTarget("Volgograd", 999000)
    ct.addTarget("Yerevan", 1201500)

    //ct.targets["Alma-Ata"].setDestroyed(true) //debug print test
}