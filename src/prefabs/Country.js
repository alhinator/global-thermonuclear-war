class Country{
    constructor(_name){
        this.name = _name
        this.targets = {}
        this.population = 0
        this.destroyed = false
    }

//get commands
    getTargets(){
        let retVal = "SIGNIFICANT TARGETS IN THE " + this.name + ":\n\n"
        let lr = 0
        for (const key in this.targets) {
            let nm = this.targets[key].name
            if(this.targets[key].destroyed) {nm += " (x)"}
            if(lr == 0 || lr == 1){ retVal += nm; for(let i = 0; i < 20-nm.length;i++){retVal+=" "}}
            else { retVal += nm + "\n"}
            lr ++ ; if(lr > 2) {lr = 0}
        }
        //console.log(retVal)
        return retVal
    }


//set commands
    addTarget(_name, _population, _hasBunkers){
        this.targets[_name] = new Target(_name, _population, _hasBunkers)
    }


}