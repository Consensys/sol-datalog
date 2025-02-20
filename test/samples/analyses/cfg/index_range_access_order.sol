contract Foo {
    uint[] a;
    uint[] b;
   
    function getX(uint[] calldata x) internal returns (uint[] calldata) {
        b.push(1);
        return x;
    }

    function getOne() internal returns (uint) {
        b.push(2);
        return 1;
    }

    function getTwo() internal returns (uint) {
        b.push(3);
        return 2;
    }

    function main(uint[] calldata x) public returns (uint[] memory){
        getX(x)[getOne():getTwo()];

        return b;
    }
}
