contract Foo {
    uint[] a;
    uint[] b;

    function moo(uint x) public payable  {}
    function goo(uint x, uint y) public  {}
   
    function getFoo() internal returns (Foo) {
        b.push(3);
        return this;
    }

    function getFun() internal returns (function (uint) internal) {
        b.push(1);
        return moo;
    }

    function getExtFun() internal returns (function (uint) external) {
        b.push(4);
        return this.moo;
    }

    function getZero() internal returns (uint) {
        b.push(2);
        return 0;
    }

    function getOne() internal returns (uint) {
        b.push(5);
        return 1;
    }


    function main() public returns (uint[] memory){
        getFun()(getZero());
        // Adds 2,1
        // so args then base

        getFoo().moo(getZero());
        // Adds 3,2
        // so base then args

        getExtFun()(getZero());
        // Adds 4,2
        // so base then args
    
        // So for internal calls its args then base, and for external calls base then args

        this.goo(getZero(), getOne());
        // Adds 2, 5 - so args in left to right order

        getFoo().moo{value:getZero()}(getOne());
        // Adds 3,2,5 - so getFoo(), then function calls options then agruments
        return b;
    }
}
