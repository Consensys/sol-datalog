pragma solidity 0.8.17;

contract Foo {
    function for2() public returns (uint) {
        uint x = 1;
        uint sum = 0;

        for (; x < 10; x++) {
            sum += x;
        }

        return sum;
    }
}
