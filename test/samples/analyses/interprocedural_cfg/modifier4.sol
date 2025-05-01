contract Foo {
    uint x;

    modifier M(uint a) {
        1;
        _;
        2;
        _;
        3;
    }
    
    function main(uint arg) M(arg+1) public returns (uint) {
        4;
    }
}
