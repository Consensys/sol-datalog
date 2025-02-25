pragma solidity 0.8.17;

contract Foo {
    function for1() public returns (uint) {
        uint sum = 0;

        for (uint x = 1; x < 10; x++) {
            sum += x;
        }

        return sum;
    }
}
