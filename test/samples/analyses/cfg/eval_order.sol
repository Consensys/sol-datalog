pragma solidity 0.8.22;

contract Test {
    function bar(uint x) external payable returns (uint a, uint b) {
        return (msg.value, x);
    }

    function foo(uint a, uint b, uint c) public pure returns (uint, uint, uint) {
        return (a, b, c);
    }

    function verifyFunArgsEvalOrder() public {
        uint x = 2;
        uint y = 1;

        (uint d, uint e, uint f) = foo(y = y * 2, y++, y += x);

        assert(d == 2);
        assert(e == 2);
        assert(f == 5);
    }

    function verifyBinOpEvalOrder() public returns (uint) {
        uint y = 5;

        // Assignments on RHS would be evaluated right-to-left, meaning:
        // 1. (y = y + 3) -> (y = 5 + 3) -> 8
        // 2. (y = y + 2) -> (y = 8 + 2) -> 10
        // 3. x = 10 - 8 -> x = 2
        //
        // See https://docs.soliditylang.org/en/latest/cheatsheet.html
        uint x = (y = y + 2) - (y = y + 3);

        assert(x == 2);
        assert(y == 10);
    }

    function verifyCallOpsEvalOrder() public payable returns (uint a, uint b) {
        uint x = 1;

        // Call ops would be evaluated first (prior to arg);
        (uint a, uint b) = this.bar{ value : x += 1 }(x);

        assert(a == 2);
        assert(b == 2);
    }

    // Call this function with msg.value non-less than 2 to succeed
    function verify() public payable {
        verifyFunArgsEvalOrder();
        verifyBinOpEvalOrder();

        this.verifyCallOpsEvalOrder{ value: msg.value }();
    }
}
