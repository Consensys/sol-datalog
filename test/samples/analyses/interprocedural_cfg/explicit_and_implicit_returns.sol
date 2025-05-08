contract Foo {
  uint x;

  function foo(bool flag) internal returns (uint z) {
    z = 0;
    
    if (flag) {
      return 0;
    }
  }

  function main() public returns (uint) {
    return foo(true);
  }
}
