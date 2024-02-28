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

function populateUSACities(ct){
    ct.addTarget("Washington DC", 50, true)
    ct.addTarget("Las Vegas", 50, true)
    ct.addTarget("Seattle", 50, true)
    ct.addTarget("San Diego", 50, true)

    //console.log("in populateusacities")
    //console.log(ct.getTargets())
}

function populateUSSRCities(ct){
    
}