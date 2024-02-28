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
    ct.addTarget("Baltimore", 786775, true)
    ct.addTarget("Boston", 562994, true)
    ct.addTarget("Charlotte", 314447, true)
    ct.addTarget("Chicago", 3005072, true)
    ct.addTarget("Colorado Springs", 215150, true)
    ct.addTarget("Dallas", 904078, true)
    ct.addTarget("Denver", 492365, true)
    ct.addTarget("Detroit", 1203339, true)
    ct.addTarget("Houston", 1595138, true)
    ct.addTarget("Jacksonville", 540920, true)
    ct.addTarget("Las Vegas", 164674, true)
    ct.addTarget("Los Angeles", 2966850, true)
    ct.addTarget("Miami", 346865, true)
    ct.addTarget("Minneapolis", 370951, true)
    ct.addTarget("New Orleans", 557515, true)
    ct.addTarget("New York", 7071639, true)
    ct.addTarget("Philadelphia", 1688210, true)
    ct.addTarget("Phoenix", 789704, true)
    ct.addTarget("Portland", 366383, true)
    ct.addTarget("Sacramento", 275741, true)
    ct.addTarget("San Diego", 875538, true)
    ct.addTarget("San Francisco", 678974, true)
    ct.addTarget("Seattle", 493846, true)
    ct.addTarget("Washington, DC", 638333, true)

    //console.log("in populateusacities")
    //console.log(ct.getTargets())
}
//population data retrieved from https://en.wikipedia.org/wiki/1980_United_States_census#City_rankings

function populateUSSRCities(ct){
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    ct.addTarget("nnnnnnnnnnn", 11111, true)
    
}