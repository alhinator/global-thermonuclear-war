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
    constructor(scene, _name, _parent, _population, _zone = "null", _x, _y, _defense = 0.3, _specifyHasBunker){
        //console.log("in city constructor:" + _name)
        this.name = _name
        this.parent = _parent //parent country
        this.zone = _zone
        this.scene = scene

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
        this.hasBunkers = (_population > 500000) || _specifyHasBunker
        this.isRadiationZone = false

        this.x = _x
        this.y = _y
        this.myLocation = new Typewriter(this.scene,this.x, this.y, "wgfont", "@",50,12,0).setDepth(3)
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
            let dfReal = this.defense_rating - strength*0.01 //using many bombs at once increases the chance of one breaching air defense.
            dfReal < 0 ? dfReal = 0.1 : dfReal              //however, they should never be guaranteed 100% success.
            if (success < dfReal){ continue;} //this means the bomb did not go off.

            this.myLocation.setTint(0xffff00) //it did - we are under attack.
            //okay. time for nuclear devastaion.
            if(this.population < 80000) { //if population is less than 90,000 - wipe that city off the map.
                this.population = -1
            } else {
                let safeCoefficient = this.hasBunkers ? 0.2 : 0.3 //if the city has nuclear bunkers, the attack is only 2/3 as effective.
                //an attack on a bunkerless target instakills 30% of population.
                let civ_killed = Math.floor(this.population * safeCoefficient + this.original_population*0.05)//guarantees 5% of og dies, plus 20 or 30% of current.
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
                this.isRadiationZone = true
            }
            

        }
        //check for destruction:
        if(this.population < 0){
            this.setDestroyed(true)
            this.population = 0
            this.injured_citizens = 0
            this.dead_citizens = this.original_population
            this.irradiated_citizens = 0
        } else if (this.population / this.original_population * 100 < 10) {
            this.setDestroyed(true)
        }



         
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

        if(this.isRadiationZone){
            let civ_irr = Math.floor(this.population * 0.02 ) //two percent of the current population will become irradiated if living in the zone.
            this.population -= civ_irr
            this.irradiated_citizens += civ_irr
        }
        

    }

    viewMe(){
        this.myLocation.setTint(0x00ffff)
        this.myLocation.setFontSize(16)
        this.scene.time.delayedCall(10000, ()=>{
            this.destroyed ? this.myLocation.setTint(0xff0000) : 
                this.isRadiationZone ? this.myLocation.setTint(0xffff00) : 
                    this.myLocation.setTint(0x00ff00) ; this.myLocation.setFontSize(12)}, null, this)
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
        //console.log(target_zone)
        for (const i in this.zones) {
            if (this.zones[i] === "ALL" || this.zones[i] === target_zone) {
                console.log(this.zones[i])
                return true
            }
        }
        return false
    }
}