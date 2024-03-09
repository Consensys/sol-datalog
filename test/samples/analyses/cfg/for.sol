pragma solidity 0.8.17;

contract Foo {
	function for1() public returns (uint) {
		uint sum = 0;

		for (uint x = 1; x < 10; x++) {
			sum += x;
		}

		return sum;
	}

	function for2() public returns (uint) {
		uint x = 1;
		uint sum = 0;

		for (; x < 10; x++) {
			sum += x;
		}

		return sum;
	}

	function for3() public returns (uint) {
		uint x = 1;
		uint sum = 0;

		for (; x < 10;) {
			sum += x;
			x++;
		}

		return sum;
	}

	function for4() public returns (uint) {
		uint x = 1;
		uint sum = 0;

		for (; ;) {
			sum += x;
			x++;

			if (x >= 10) {
				break;
			} 
		}

		return sum;
	}

	function for5() public returns (uint) {
		uint x = 1;
		uint sum = 0;

		for (; ; x++) {
			sum += x;

			if (x >= 10) {
				break;
			} 
		}

		return sum;
	}

	function for6() public returns (uint) {
		
		uint sum = 0;

		for (uint x = 1; ; x++) {
			sum += x;

			if (x >= 10) {
				break;
			} 
		}

		return sum;
	}

	function for7() public returns (uint) {
		
		uint sum = 0;

		for (uint x = 1; x < 10;) {
			sum += x;
			x++;
		}

		return sum;
	}

	function for8() public returns (uint) {
		uint sum = 0;

		for (uint x = 1;;) {
			sum += x;
			x++;

			if (x >= 10) {
				break;
			} 
		}

		return sum;
	}
}
