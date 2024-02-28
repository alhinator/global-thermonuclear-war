class Country{
    constructor(_name){
        this.name = _name
        this.targets = {}
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
    addTarget(_name, _population, _defense){
        this.targets[_name] = new Target(_name, this, _population, _defense)
    }


//get commands
    getPopulationStats(){
        
        let og = 0, curr = 0, dead = 0, irr = 0, inj = 0

        for (const key in this.targets){
            og += this.targets[key].original_population
            console.log(og)
            curr += this.targets[key].population
            dead += this.targets[key].dead_citizens
            irr += this.targets[key].irradiated_citizens
            inj += this.targets[key].injured_citizens
        }

        return {
            original: og, 
            current: curr,
            dead: dead,
            irradiated: irr,
            injured: inj,
            percent: Math.floor(og/curr*100)
        }

    }
    
    get


}