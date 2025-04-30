contract Foo {
  uint x;

  function foo(uint a) internal {
    x+=a;
    boo(a);
  }

  function boo(uint b) internal {
    if (x < 10) {
      foo(b);
    }
  }

  function main() public {
    x = 1;
    foo(3);
    x = 3;
  }
}
