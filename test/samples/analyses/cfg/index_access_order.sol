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
        a.push(1); a.push(2);
        getA()[getOne()] = 0;

        // Returns [1,2]
        return b;
    }
}
