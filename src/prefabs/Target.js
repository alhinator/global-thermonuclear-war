/*ZONES:

US_WEST - western seaboard + hawaii
US_CENTRAL - co, utah, tex, idaho, etc. the rockies.
US_MIDWEST - from dakotas to mn/ohio/illinois
US_SOUTH - southeast area, west of texas and south of DC
US_EAST - eastern seaboard to ohio, DC inclusive

RU_WEST - north eastern european, northwestern russia.
RU_SOUTH - territories south of western russia and south of the urals, including the balkans, and kazakhstan
RU_URAL - mid-russia, the urals area
RU_SIBERIA - the central and western siberia regions, reaching to the northeast of the country
RU_ASIA - southeast russia and its west-asia territories.

ALL - used for vehicle; means it can target any location. otherwise, locations are listed in an array.
*/

class Target {
    constructor(scene, _name, _parent, _population, _zone = "null", _x, _y, _defense = 0.3){
        //console.log("in city constructor:" + _name)
        this.name = _name
        this.parent = _parent //parent country
        this.zone = _zone

        this.original_population = _population
        this.population = _population
        this.dead_citizens = 0
        this.injured_citizens = 0
        this.irradiated_citizens = 0
        //here's the deal with reporting injured and irradiated citizens. we take them out of the "population" when they become inj or irr
        //  for calculation purposes, but they are still included in the "living" population when the country reports it.

        this.defense_rating = _defense

        this.destroyed = false
        this.isActivelyTargeted = false
        this.hasBunkers = (_population > 500000)
        this.isRadiationZone = false

        this.x = _x
        this.y = _y
        this.myLocation = new Typewriter(scene,this.x, this.y, "wgfont", "@",50,12,0).setDepth(3)
        this.myLocation.setTint(0x00ff00)
        //this.myLocation.activateGlow()
        //KEEP GLOW OFF
        this.myLocation.text = "@"
        this.myLocation.visible = false
    }

    setVisible(_b){
        this.myLocation.visible = _b
    }
    setDestroyed(_b){
        this.destroyed = _b
        this.myLocation.text = this.destroyed ? "x" : "@"
        this.myLocation.setTint(0xff0000)
    }

    getDestroyed(){
        return this.destroyed
    }

    bombLanded(strength){
        console.log("in bomb landed: " + this.name + "   s" + strength)
        for(let i = 1; i <= strength ; i++){
            //strength = the number of bombs being sent. 
            //repeat for each bomb that's attempted.
            let success = Math.random()
            if (success < this.defense_rating){ continue;} //this means the bomb did not get past our air defenses.
            this.myLocation.setTint(0xffff00) //it did - we are under attack.
            //okay. time for nuclear devastaion.
            let safeCoefficient = this.hasBunkers ? 0.2 : 0.3 //if the city has nuclear bunkers, the attack is only 2/3 as effective.
            //an attack on a bunkerless target instakills 40% of population.
            let civ_killed = Math.floor(this.population * safeCoefficient)
            let civ_alr_inj_killed = Math.floor(this.injured_citizens * 0.5 * safeCoefficient) // injured civs can still get nuked. sorry </3
            let civ_alr_irr_killed = Math.floor(this.irradiated_citizens * 0.3 * safeCoefficient) // irradiated civs can still get nuked. sorry </3
            let civ_inj = Math.floor(civ_killed * 0.5 * safeCoefficient) //a middling amount of civilians are injured.
            let civ_irr = Math.floor(civ_killed * 0.25 * safeCoefficient) //a smaller amount are irradiated.
            //so, the effective difference is that both injured and irradiated civilians will  have a chance to die or recover; irradiation is more deadly.
            console.log(`killed by bomb ${i}: ${civ_killed} alr_inj:${civ_alr_inj_killed} alr_irr:${civ_alr_irr_killed} |  inj: ${civ_inj} |  irr: ${civ_irr} `)
            this.population -= (civ_killed + civ_inj + civ_irr)
            this.dead_citizens += civ_killed
            this.injured_citizens += civ_inj - civ_alr_inj_killed
            this.irradiated_citizens += civ_irr - civ_alr_irr_killed

        }
        //do stuff
        //debug: 
    }

    tickInjIrr(){
        //every few ingame minutes, 1% of injured or irr civilians will either become un-injured, or die. 
        let injured_sub = Math.ceil(this.injured_citizens * 0.01)
        if(injured_sub > 0){
            let live_coef = Math.random()
            if (live_coef > 0.5) { //https://www.youtube.com/watch?v=J6pZuAJjBa4 
                this.injured_citizens -= injured_sub
                this.population += injured_sub
            } else {
                this.injured_citizens -= injured_sub
                this.dead_citizens += injured_sub
            }
        }
        


        //now tick the irradiated.
        let irr_sub = Math.ceil(this.irradiated_citizens * 0.03)
        if(irr_sub > 0){
            let live_coef = Math.random()
            if (live_coef > 0.75) { //https://www.youtube.com/watch?v=AtNSbMA0s7U 
                this.irradiated_citizens -= irr_sub
                this.population += irr_sub
            } else {
                this.irradiated_citizens -= irr_sub
                this.dead_citizens += irr_sub
            }
        }
        

    }
    
}

/*VEHICLE TYPES 
    SUB
    ICBM
    JET
*/

class Vehicle {
    constructor(_name, _owner, _type, _dependencies, _capacity, _zones){
        this.name = _name
        this.owner = _owner
        this.type = _type
        this.dependencies = _dependencies
        this.max_capacity = _capacity
        this.capacity = this.max_capacity
        this.zones = _zones
    }

    verifyDepend(){ //if  ANY of this vehicle's dependencies are NOT destroyed, return true.
        if (this.dependencies[0] == "NONE") {return true}
        for (let i = 0 ; i < this.dependencies.length; i++) {
            let dep = this.owner.getTargetByName(this.dependencies[i])
            if (!dep) { console.log(`${this.name} : verifyDepend() : dependency not in owner's targets`)}
            if (dep && dep.getDestroyed() == false){
                return true
            }
        }
        return false
    }

    verifyZone(target_zone){ //if the target zone is also in this vehicle's zones, return true. target_zone should be a string.
        this.zones.forEach(element => {
            if (element == "ALL" || element === target_zone) return true
        });
        return false
    }
}