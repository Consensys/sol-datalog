abstract contract Base1 {
    uint[] arr;

    modifier M() virtual;

    constructor() M() {
        arr.push(0);
    }
}

contract Base2 is Base1 {
    modifier M() virtual override {
        arr.push(2);
        _;
        arr.push(3);
    }

    constructor() M() {
        arr.push(1);
    }
}

contract Base3 is Base2 {
    modifier M() virtual override {
        arr.push(5);
        _;
        arr.push(6);
    }

    constructor() M() {
        arr.push(4);
    }
}

/// The expected result of calling `(new Foo()).getArr()` is
///     `[5,0,6,5,1,6,5,4,6,7]`
///
/// I.e. for the constructors in Base1, Base2 and Base3 the virtual modifier M
/// resolves to Base3.M.
contract Foo is Base3 {
    constructor() {
        arr.push(7);
    }

    function getArr() public view returns (uint[] memory) {
        return arr;
    }
}