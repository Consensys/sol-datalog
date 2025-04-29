contract Base1 {
    constructor(uint a1, uint b1) public {
    }
}

contract Base2 is Base1 {
    constructor (uint a2, uint b2) Base1(a2+1, b2+2) {

    }
}

abstract contract Base3 is Base1 {
    constructor(uint a3, uint b3) {}
}

contract Child is Base3(5, 6), Base2 {
    constructor() Base2(7, 8) public {}
}
