pragma solidity 0.8.17;

contract Foo {
    function for3() public returns (uint) {
        uint x = 1;
        uint sum = 0;

        for (; x < 10;) {
            sum += x;
            x++;
        }

        return sum;
    }
}
