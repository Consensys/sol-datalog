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
