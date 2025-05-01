library Lib {
    function inc(uint x) internal returns (uint) {
        return x + 1;
    }
}

contract Foo {
    function main(uint a) public returns (uint) {
        uint b = Lib.inc(a);
        return b;
    }
}
