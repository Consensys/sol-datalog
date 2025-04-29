contract Foo {
  uint x;

  function foo() internal {
    x = 2;
  }

  function boo() internal {
    foo();
  }

  function moo() internal {
    boo();
  }

  function main() public {
    x = 1;
    moo();
    x = 3;
  }
}
