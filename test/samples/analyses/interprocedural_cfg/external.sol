contract Foo {
  uint x;

  function foo() internal {
    x = 2;
  }

  function boo(uint x) public returns (uint){
    return x+1;
  }

  function moo() internal {
    x = 4;
  }

  function main(Foo o) public {
    x = 1;
    foo();
    x = o.boo(42);
    moo();
  }
}
