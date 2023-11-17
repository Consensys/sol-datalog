pragma solidity "0.8.17";

contract Postive1 {
	function _msgSender() internal virtual returns (address) {
		return msg.sender;
	}

	function foo(uint x) public {
		msg.sender;
	}

	function bar() public {
		_msgSender();
	}
}



contract Negative1 {
	function _msgSender() internal virtual returns (address) {
		return msg.sender;
	}

	function foo(uint x) public {
		_msgSender();
	}

	function bar() public {
		_msgSender();
	}
}


contract Negative2 {
	function _msgSender() internal virtual returns (address) {
		return msg.sender;
	}

	function foo(uint x) public {
		msg.sender;
	}

	function bar() public {
		msg.sender;
	}
}

contract Positive2Base {
	function _msgSender() internal virtual returns (address) {
		return msg.sender;
	}

	function foo(uint x) public {
		msg.sender;
	}

}

contract Postive2 is Positive2Base{

	function bar() public {
		_msgSender();
	}
}


contract Positive3Base {
	function _msgSender() internal virtual returns (address) {
		return msg.sender;
	}

	function bar() public {
		_msgSender();
	}
}

contract Postive3 is Positive3Base{
	function foo(uint x) public {
		msg.sender;
	}

}