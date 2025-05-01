contract Foo {
    uint x;

    modifier M(uint a) {
        1;
        _;
        2;
    }

    function foo() M(42) internal {
        3;
    }
    
    function main(uint arg) public returns (uint) {
        foo();
    }
}
