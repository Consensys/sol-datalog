contract Foo {
    uint[] a;
    uint[] b;

    function moo() external payable  {}
   
    function getAddr() internal returns (Foo) {
        b.push(1);
        return this;
    }

    function getZero() internal returns (uint) {
        b.push(2);
        return 0;
    }

    function getGas() internal returns (uint) {
        b.push(3);
        return 2200;
    }

    function main() public returns (uint[] memory){
        getAddr().moo{gas: getGas(), value: getZero()}();
        // Adds 1,3,2
        // so base, then gas then value
        getAddr().moo{value: getZero(), gas: getGas()}();
        // Adds 1,2,3
        // so base, then value then gas
        // So function call options are evaluated left-to-right

        return b;
    }
}
