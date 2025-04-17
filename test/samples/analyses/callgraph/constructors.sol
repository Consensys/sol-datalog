contract Base1 {
    constructor(uint x) {}
}

contract Base2 {
    constructor(uint z) {}
}

contract Base3 {
    constructor(uint w) {}
}

contract Child is Base1, Base2(1), Base3 {
    constructor() Base1(0) Base3(3) {

    }
}
