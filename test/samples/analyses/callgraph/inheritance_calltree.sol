contract Base {
  function foo() internal virtual {
    boo();
  }

  function boo() internal {
  }

  function goo() virtual internal {
    foo();
  }
}

contract Base1 is Base {
  function foo() internal virtual override {
    moo();
  }

  function moo() internal {}

}

contract Child is Base1 {
  function doo() internal {
    foo();
  }
}
