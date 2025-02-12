pragma solidity 0.8.17;

contract Foo {
	function a() internal {
		c();
	}

	function b() external {
        d();
    }

	function c() internal {
        d();
    }

    function d() internal {
		f();
	}

	function f() public payable {
		this.f{value: 1}();
	}

	function main() public {
		a();
		this.b();
	}

    function rec() public {
        rec();
    }
}
