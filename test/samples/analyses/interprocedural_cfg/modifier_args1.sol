contract Foo {
    modifier M(uint a, uint b) {
        2;
        _;
        4;
    }

    function main() M(0+10, 1+12) public {
        3;
    }
}
