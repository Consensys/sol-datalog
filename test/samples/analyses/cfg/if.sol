pragma solidity 0.8.17;

contract Foo {
	function main() public {
		uint x = 1;
		if ( x > 0 ) {
			x++;
		} else {
			x--;
		}

		uint y = x;
	}
}
