type MyUint is uint256;

function add(MyUint a, MyUint b) pure returns (MyUint) {
  return MyUint.wrap(MyUint.unwrap(a) + MyUint.unwrap(b));
}

function bwnot(MyUint a) pure returns (MyUint) {
  return MyUint.wrap(~MyUint.unwrap(a));
}

using { add as + } for MyUint global;
using { bwnot as ~ } for MyUint global;

contract Foo {

  function main(MyUint a, MyUint b) internal returns (MyUint) {
    return a + b;
  }

  function foo(MyUint a) internal returns (MyUint) {
    return ~a;
  }
}
