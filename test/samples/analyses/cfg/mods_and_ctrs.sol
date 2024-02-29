pragma solidity 0.8.22;

contract A {
    modifier modBefore() {
        _;
    }

    modifier modAfter() {
        _;
    }

    constructor() modBefore() modBefore() modAfter() {}
}

contract B {
    modifier modSome() {
        _;
    }

    modifier modOther() {
        _;
    }

    constructor() modSome() {}
}

contract C is A(), B() {
    constructor() {}
}

contract D is A, B {
    constructor() A() B() {}
}

contract E is A, B {
    constructor () A() modOther() B() {}
}

contract F is A, B() {
    constructor() A() modOther() {}
}

contract G is A(), B {
    constructor() modOther() B() {}
}

contract H is A(), B() {
    constructor() modOther() {}
}

// ----------------------------------------

contract X {
    uint public a;

    modifier some() virtual {
        a = 1;

        _;
    }

    constructor () some() {}
}

contract Y is X {
    modifier some() override {
        a = 2;

        _;
    }

    constructor() X() {}
}

contract Z is X() {
    modifier some() override {
        a = 3;

        _;
    }
}

// ----------------------------------------

contract S {
    uint8[] public arr;

    modifier bef(uint8 v) {
        arr.push(v);

        _;
    }

    modifier aft(uint8 v) {
        _;

        arr.push(v);
    }

    constructor() bef(1) bef(2) aft(5) aft(4) {
        arr.push(3);
    }

    function check() public view returns (uint8[] memory) {
        return arr;
    }

    // check would return [1,2,3,4,5]
}

contract V is S {
    constructor() bef(6) aft(10) S() bef(7) aft(9) {
        arr.push(8);
    }

    // check would return [1,2,3,4,5,6,7,8,9,10]
}
