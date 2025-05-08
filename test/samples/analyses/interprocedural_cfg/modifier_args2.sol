contract Foo {
    function foo(uint arg) internal returns (uint) {
        return arg + 1000;
    }

    modifier M(uint a) {
        2;
        _;
        4;
    }

    function main() M(foo(300)) public {
        3;
    }
}
