class Target {
    constructor(_name, _parent, _population, _hasBunkers){
        //console.log("in city constructor:" + _name)
        this.name = _name
        this.parent = _parent //parent country
        this.original_population = _population
        this.population = _population
        this.destroyed = false
        this.isActivelyTargeted = false
        this.hasBunkers = _hasBunkers
        this.isRadiationZone = false
    }

    
}