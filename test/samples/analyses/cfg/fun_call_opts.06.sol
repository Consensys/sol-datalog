pragma solidity 0.6.0;

contract Test {
    function a() public payable {}

    function some() public {
        uint y = 3600;

        this.a.value(y++).gas(y++)();

        this.a.value(y++);
        this.a.gas(y++);
    }
}
