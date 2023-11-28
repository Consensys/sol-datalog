pragma solidity 0.8.22;

contract Test {
    function some() public returns (uint, uint, uint) {
        uint t = 0;

        (uint a, uint b, uint c) = (t++, t++, t++);

        uint x;
        uint y;
        uint z;

        (, (, (x, (y, (z))))) = (0, (1, (2, (3, (4)))));

        return (x, y, z);
    }
}
