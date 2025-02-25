pragma solidity 0.8.17;

contract Foo {
    function for6() public returns (uint) {
        
        uint sum = 0;

        for (uint x = 1; ; x++) {
            sum += x;

            if (x >= 10) {
                break;
            } 
        }

        return sum;
    }
}
