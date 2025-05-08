contract Foo {
    uint x;
    uint[] public arr;

    modifier M1(uint a) {
        arr.push(x);
        _;
    }

    modifier M2(uint a) {
        arr.push(x);
        _;
    }
    function main() M1(x++) M2(x+=2) public {
        // Afterwards arr will have [1,3] as contents.
        // meaning we evalute first M1's argument, then M1's body up to the placeholder,
        // then M2' argument.
    }
}
