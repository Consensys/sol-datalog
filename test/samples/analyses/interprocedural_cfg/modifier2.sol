contract Foo {
    uint x;

    modifier M(uint a) {
        1;
        _;
        2;
    }

    modifier M2(uint a) {
        5;
        _;
        6;
    }
    
    function main(uint arg) M(arg+1) M2(arg+2) public returns (uint) {
        3;
    }
}
