contract Foo {
  uint x;

  function foo(bool flag) internal returns (uint) {
    if (flag) {
      return 0;
    } else {
      return 1;
    }
  }

  function main() public returns (uint) {
    return foo(true);
  }
}
