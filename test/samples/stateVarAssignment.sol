contract Foo {
	uint x;
	uint y;

	uint[] arr_yes;
	uint[] arr_no;

	struct S {
		uint[] arr_field_yes;
		uint[] arr_field_no;
		uint field_yes;
		uint field_no;
	}

	S s_yes;
	S s_no;

        function foo(uint a, uint b) public returns (uint r) {
		r = a + b + x;
		x = a + r;

	}

        function bar() public returns (uint r) {
		(arr_yes[0], , r) = (3, 4, 5);
		s_yes.arr_field_yes[0] = 1;
	}
}
