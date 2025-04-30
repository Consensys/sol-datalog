type MyUint is uint256;

function add(MyUint d, MyUint e) pure returns (MyUint) {
  return MyUint.wrap(MyUint.unwrap(d) + MyUint.unwrap(e));
}

function bwnot(MyUint f) pure returns (MyUint) {
  return MyUint.wrap(~MyUint.unwrap(f));
}

using { add as + } for MyUint global;
using { bwnot as ~ } for MyUint global;

contract Foo {
  function main(MyUint a, MyUint b) public returns (MyUint) {
    return a + b;
  }
}
