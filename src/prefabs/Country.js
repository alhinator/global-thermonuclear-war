class Country{
    constructor(_name){
        this.name = _name
        this.targets = {}
        this.vehicles = {}
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

    getTargetByName(key){
        //console.log(this.targets[key])
        if (this.targets[key] != null) { return this.targets[key]}
        else { /*console.log("returning false in GTBN")*/ ; return false }
    }

    getTargetInfo(key, mgr){
        let tg = this.getTargetByName(key)
        if(!tg) { return false }

        let retVal = `DISPLAYING ${tg.name.toUpperCase()} INFO:\n\n` + 
`PARENT COUNTRY: ${this.name}
ZONE: ${tg.zone}
ORIGINAL POPULATION: ${tg.original_population}
CURRENT LVING POPULATION: ${tg.population} (${Math.floor((tg.population / tg.original_population) * 100)}%)
POPULATION KILLED SINCE T0: ${tg.dead_citizens}
CURRENT IRRADIATED POPULATION (T+${mgr.gameTime}): ${tg.irradiated_citizens}
CURRENT INJURED POPULATION (T+${mgr.gameTime}): ${tg.injured_citizens}`

        if(tg.getDestroyed) {retVal += `\n\n!!DESTROYED!!`}
        return retVal
        
    }

    getVehicles(){
        let retVal = "DELIVERY METHODS IN THE " + this.name + ":\n\n"
        let lr = 0
        for (const key in this.vehicles) {
            let nm = this.vehicles[key].name + " (" + this.vehicles[key].type[0] + ")" 
            if(!this.vehicles[key].verifyDepend()) {nm += " (x)"}
            if(lr == 0 || lr == 1){ retVal += nm; for(let i = 0; i < 20-nm.length;i++){retVal+=" "}}
            else { retVal += nm + "\n"}
            lr ++ ; if(lr > 2) {lr = 0}
        }
        return retVal
    }

    getVehicleByName(key){
        //console.log(this.targets[key])
        if (this.vehicles[key] != null) { return this.vehicles[key]}
        else { /*console.log("returning false in GVBN")*/ ; return false }
    }

    getVehicleInfo(key, mgr){
        let tg = this.getVehicleByName(key)
        if(!tg) { return false }

      
        let retVal = `DISPLAYING ${tg.name.toUpperCase()} INFO:\n\n` + 
`PARENT COUNTRY: ${this.name}
PAYLOAD DELIVERY METHOD: ${tg.type}
TARGETABLE ZONES: ${tg.zones}
CURRENT MISSILE STOCK: ${tg.capacity}
DEPENDENCIES: ${tg.dependencies}
`
        if(tg.dependencies[0] == "NONE") {retVal +=
`THIS VEHICLE WILL REMAIN OPERATIONAL
UNTIL ALL YOUR CITIES ARE DESTROYED.`}
        else if(tg.verifyDepend()) {retVal +=
`IF ALL DEPENDENCIES ARE DESTROYED,
THIS VEHICLE BECOMES INACTIVE.`}
        else { retVal += `\n\n!!INACTIVE!!` }
        return retVal
        
    }


//set commands
    addTarget(_name, _population, _defense){
        this.targets[_name] = new Target(_name, this, _population, _defense)
    }

    addVehicle(_name, _type, _dependencies, _capacity, _zones){
        this.vehicles[_name] = new Vehicle(_name, this, _type, _dependencies, _capacity, _zones)
    }

//get commands
    getPopulationStats(mgr){
        let og = 0, curr = 0, dead = 0, irr = 0, inj = 0
        for (const key in this.targets){
            og += this.targets[key].original_population
            console.log(og)
            curr += this.targets[key].population
            dead += this.targets[key].dead_citizens
            irr += this.targets[key].irradiated_citizens
            inj += this.targets[key].injured_citizens
        }
        let pop_data = {
            original: og, 
            current: curr,
            dead: dead,
            irradiated: irr,
            injured: inj,
            percent: Math.floor(og/curr*100)
        }

        let retVal = `DATA FOR UNITED STATES:\n\n` + 
`ORIGINAL POPULATION (T0): ${pop_data.original}
CURRENT LIVING POPULATION (T+${mgr.gameTime}): ${pop_data.original} (${pop_data.percent}%)
POPULATION KILLED SINCE T0: ${pop_data.dead}
CURRENT IRRADIATED POPULATION (T+${mgr.gameTime}): ${pop_data.irradiated}
CURRENT INJURED POPULATION (T+${mgr.gameTime}): ${pop_data.injured}`

        return retVal
    }
    
    get


}