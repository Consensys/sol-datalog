pragma solidity 0.8.29;

abstract contract Base {
    uint x;

    modifier M() virtual;
    function foo() M() public {
        0;
    }
}

contract Child1 is Base {
    modifier M() override {
        1;
        _;
        2;
    }
}


contract Child2 is Base {
    modifier M() override {
        3;
        _;
        4;
    }
}
