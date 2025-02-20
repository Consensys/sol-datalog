contract Foo {
    uint[] a;
    uint[] b;
   
    function getA() internal returns (uint[] storage) {
        b.push(1);
        return a;
    }

    function getOne() internal returns (uint) {
        b.push(2);
        return 1;
    }

    function main() public returns (uint[] memory){
        a.push(0);
        getA()[0] = getOne();

        // Returns [2, 1]
        return b;
    }
}
