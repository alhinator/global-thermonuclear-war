/*ZONES:

US_WEST - western seaboard + hawaii
US_CENTRAL - co, utah, tex, idaho, etc. the rockies.
US_MIDWEST - from dakotas to mn/ohio/illinois
US_SOUTH - southeast area, west of texas and south of DC
US_EAST - eastern seaboard to ohio, DC inclusive

EU_EAST - from east germany to far west of the black sea, containing the balkans
RU_WEST - north eastern european, northwestern russia. 
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

        this.defense_rating = _defense

        this.destroyed = false
        this.isActivelyTargeted = false
        this.hasBunkers = (_population > 800000)
        this.isRadiationZone = false

        this.x = _x
        this.y = _y
        this.myLocation = new Typewriter(scene,this.x, this.y, "wgfont", "@",0,10,0).setDepth(3)
        //this.myLocation.activateGlow()
        this.myLocation.text = "@"
        //this.myLocation.visible = false
    }

    setDestroyed(_b){
        this.destroyed = _b
        this.myLocation.text = this.destroyed ? "x" : "@"
    }

    getDestroyed(){
        return this.destroyed
    }

    bombLanded(){
        console.log("in bomb landed: " + this.name + "   s" + strength)
        //do stuff
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