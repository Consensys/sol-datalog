contract Foo {
    function nonRec() internal {
        a();
    }

    function a() internal {
        b();
    }

    function b() internal {
    }

    function simpleRec() internal {
        simpleRec();
    }

    function mutRec() internal {
        c();
    }

    function c() internal {
        mutRec();
    }

    function condRec(bool flag) internal {
        if (flag) {
            e(!flag);
        }
    }

    function e(bool flag) internal {
        if (flag) {
            condRec(!flag);
        }
    }
}