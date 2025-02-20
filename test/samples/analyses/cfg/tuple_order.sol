contract Foo {
    uint[] a;
    uint[] b;

    function getZero() internal returns (uint) {
        b.push(1);
        return 0;
    }

    function getOne() internal returns (uint) {
        b.push(2);
        return 1;
    }


    function main() public returns (uint[] memory){
        (uint c, uint d) = (getZero(), getOne());
        // Adds 1,2 - so left to right
        return b;
    }
}
