class Country {
    constructor(_name, scene, _zones) {
        this.name = _name
        this.targets = {}
        this.vehicles = {}
        this.zones = _zones
        this.destroyed = false
        this.scene = scene
    }

    //get commands
    getTargets() {
        let retVal = "SIGNIFICANT TARGETS IN THE " + this.name + ":\n\n"
        for (const zz in this.zones) {
            let c_zone = this.zones[zz]
            let lr = 0
            retVal += "[" + c_zone + "]\n"
            //less efficient, but better for players. sort by zone.
            for (const key in this.targets) {
                if (this.targets[key].zone == c_zone) {
                    let nm = this.targets[key].name
                    if (this.targets[key].destroyed) { nm += " (x)" }
                    if (lr == 0 || lr == 1) { retVal += nm; for (let i = 0; i < 20 - nm.length; i++) { retVal += " " } }
                    else { retVal += nm + "\n" }
                    lr++; if (lr > 2) { lr = 0 }
                }
            }
            if (retVal.charAt(retVal.length - 1) != '\n') {
                retVal += '\n'
            }
            retVal += '\n'
        }


        //console.log(retVal)
        return retVal
    }

    getVehicles() {
        let retVal = "DELIVERY METHODS IN THE " + this.name + ":\n\n"
        let lr = 0
        for (const key in this.vehicles) {
            let nm = this.vehicles[key].name
            if (!this.vehicles[key].verifyDepend() || this.vehicles[key].capacity <= 0) { nm += " (x)" }
            if (lr == 0 || lr == 1) { retVal += nm; for (let i = 0; i < 20 - nm.length; i++) { retVal += " " } }
            else { retVal += nm + "\n" }
            lr++; if (lr > 2) { lr = 0 }
        }
        return retVal
    }

    getTargetByName(key) {
        //console.log(this.targets[key])
        if (this.targets[key] != null) { return this.targets[key] }
        else { /*console.log("returning false in GTBN")*/; return false }
    }

    getVehicleByName(key) {
        //console.log(this.targets[key])
        if (this.vehicles[key] != null) { return this.vehicles[key] }
        else { /*console.log("returning false in GVBN")*/; return false }
    }

    getVehicleInfo(key, mgr) {
        let tg = this.getVehicleByName(key)
        if (!tg) { return false }


        let retVal = `DISPLAYING ${tg.name.toUpperCase()} INFO:\n\n` +
            `PARENT COUNTRY: ${this.name}
PAYLOAD DELIVERY METHOD: ${tg.type}
TARGETABLE ZONES: ${tg.zones}
CURRENT MISSILE STOCK: ${tg.capacity}
DEPENDENCIES: ${tg.dependencies}
`
        if (tg.dependencies[0] == "NONE") {
            retVal +=
                `THIS VEHICLE WILL REMAIN OPERATIONAL
UNTIL ALL CITIES ARE DESTROYED.`}
        else if (tg.verifyDepend()) {
            retVal +=
                `IF ALL DEPENDENCIES ARE DESTROYED,
THIS VEHICLE BECOMES INACTIVE.`}
        else { retVal += `\n\n!!INACTIVE!!` }
        return retVal

    }

    getTargetInfo(key, mgr) {
        let tg = this.getTargetByName(key)
        if (!tg) { return false }

        let retVal = `DISPLAYING ${tg.name.toUpperCase()} INFO:\n\n` +
            `PARENT COUNTRY: ${this.name}
ZONE: ${tg.zone}
ORIGINAL POPULATION: ${tg.original_population}
CURRENT LIVING POPULATION: ${tg.population + tg.injured_citizens + tg.irradiated_citizens} (${Math.floor(((tg.population + tg.injured_citizens + tg.irradiated_citizens) / tg.original_population) * 100)}%)
POPULATION KILLED SINCE T0: ${tg.dead_citizens}
CURRENT IRRADIATED POPULATION (${mgr.gameTime}): ${tg.irradiated_citizens}
CURRENT INJURED POPULATION (${mgr.gameTime}): ${tg.injured_citizens}
AIR DEFENSE COEFFICIENT: ${tg.defense_rating}`

        if (tg.getDestroyed()) { retVal += `\n\n!!DESTROYED!!` }
        return retVal

    }

    internalGetStats(mgr) {
        let og = 0, curr = 0, dead = 0, irr = 0, inj = 0
        for (const key in this.targets) {
            og += this.targets[key].original_population
            //console.log(og)
            curr += this.targets[key].population
            dead += this.targets[key].dead_citizens
            irr += this.targets[key].irradiated_citizens
            inj += this.targets[key].injured_citizens
        }
        let pop_data = {
            original: og,
            current: curr + inj + irr,
            dead: dead,
            irradiated: irr,
            injured: inj,
            percent: Math.floor((curr + inj + irr) / og * 100)
        }
        return pop_data
    }

    getPopulationStats(mgr) {
        let pop_data = this.internalGetStats(mgr)

        let retVal = `POPULATION DATA FOR ${this.name}:\n\n` +
            `ORIGINAL POPULATION (T0): ${pop_data.original}
CURRENT LIVING POPULATION (${mgr.gameTime}): ${pop_data.current} (${pop_data.percent}%)
POPULATION KILLED SINCE T0: ${pop_data.dead}
CURRENT IRRADIATED POPULATION (${mgr.gameTime}): ${pop_data.irradiated}
CURRENT INJURED POPULATION (${mgr.gameTime}): ${pop_data.injured}`

        return retVal
    }

    checkDestroyed(mgr) {
        let pop_data = this.internalGetStats(mgr)
        if (pop_data.percent < 20) {
            //if less than twenty percent of the population remains, including the irradiated and injured, this country CANNOT WIN
            //HOWEVER, they may continue launching missiles if they are able.
            return -1
        } else if (pop_data.percent <= 0) {
            //this country has been utterly destroyed.
            //console.log(this.name + " has been destroyed.")
            return 1
        } else {
            return 0
        }
    }

    //set commands
    addTarget(_name, _population, zone, x, y, _defense) {
        this.targets[_name] = new Target(this.scene, _name, this, _population, zone, x, y, _defense)
    }

    addVehicle(_name, _type, _dependencies, _capacity, _zones) {
        this.vehicles[_name] = new Vehicle(_name, this, _type, _dependencies, _capacity, _zones)
    }
}