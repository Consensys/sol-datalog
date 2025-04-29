contract Base {
    uint[] public arr;

    constructor(uint ind, uint val) public {
        assert(arr[ind] == val);
    }
}

contract Child is Base {
    constructor() Base(0, arr.push() = 42) {
        arr.push(43);
        assert(arr.length == 2);
        assert(arr[1] == 43);
    }
}
