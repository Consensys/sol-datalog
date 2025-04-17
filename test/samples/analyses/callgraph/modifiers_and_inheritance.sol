contract Base1 {
    uint[] arr;

    constructor() {
        arr.push(0);
    }
}

contract Base2 is Base1 {
    modifier M() {
        arr.push(2);
        _;
        arr.push(3);
    }

    constructor() M() {
        arr.push(1);
    }
}

contract Base3 is Base1 {
    constructor() {
        arr.push(4);
    }
}

// The expected result of calling `(new Foo()).getArr()` is 
//   `[0,2,1,3,4,5,8,7,9,6]`.
// I.e. the order of pushing onto `arr` is:
//  1. Base1.constructor()
//  2. Base2.M()
//  3. Base2.constructor()
//  4. Base2.M()
//  5. Base3.constructor()
//  6. Foo.M1()
//  7. Foo.M2()
//  8. Foo.constructor
//  9. Foo.M2()
//  10. Foo.M1()
contract Foo is Base2, Base3 {
    modifier M1() {
        arr.push(5);
        _;
        arr.push(6);
    }

    modifier M2() {
        arr.push(8);
        _;
        arr.push(9);
    }


    constructor() M1() M2() {
        arr.push(7);
    }

    function getArr() public view returns (uint[] memory) {
        return arr;
    }
}