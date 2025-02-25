pragma solidity 0.8.17;

contract Foo {
    function for5() public returns (uint) {
        uint x = 1;
        uint sum = 0;

        for (; ; x++) {
            sum += x;

            if (x >= 10) {
                break;
            } 
        }

        return sum;
    }
}
