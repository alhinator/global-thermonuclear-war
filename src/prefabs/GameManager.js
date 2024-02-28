class GameManager {
    constructor(scene){

        this.FSM = new StateMachine('Initial', {
            Initial: new InitialState(),
            SideSelect: new SideSelect(),
        }, [scene, this])

        this.team = -1
    }
}



function helpCalled(scene, mgr){
    let target = scene.infoPanel
    target.clearText()
    target.append_text_auto_type(helpText)

}