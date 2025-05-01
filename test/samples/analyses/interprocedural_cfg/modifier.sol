contract Foo {
    uint x;

    modifier M(uint a) {
        x = 1;
        _;
        x = 2;
    }
    
    function main(uint arg) M(arg+1) public returns (uint) {
        x = 3;
    }
}
