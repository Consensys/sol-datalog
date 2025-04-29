#include <souffle/SouffleInterface.h>
#include <iostream>

using namespace std;

extern "C"
{
    souffle::RamDomain findRecursiveCall(
        souffle::SymbolTable *symbolTable,
        souffle::RecordTable *recordTable,
        souffle::RamDomain callList,
        souffle::RamDomain fun)
    {
        assert(symbolTable && "NULL symbol table");
        assert(recordTable && "NULL record table");

        while (callList != 0)
        {
            const souffle::RamDomain *tuple = recordTable->unpack(callList, 2);
            const souffle::RamDomain nodeRef = tuple[0];
            const souffle::RamDomain nextCallList = tuple[1];

            tuple = recordTable->unpack(nodeRef, 2);

            if (tuple[0] == 1)
            {
                // Call { id: CallsiteType, target: CalleeType }
                tuple = recordTable->unpack(tuple[1], 2);

                if (tuple[1] == fun)
                {
                    // Recursive call detected
                    return callList;
                }
                break;
            }

            callList = nextCallList;
        }

        cerr << "\n";

        return 0;
    }

    souffle::RamDomain concatCallLists(
        souffle::SymbolTable *symbolTable,
        souffle::RecordTable *recordTable,
        souffle::RamDomain a,
        souffle::RamDomain b)
    {
        assert(symbolTable && "NULL symbol table");
        assert(recordTable && "NULL record table");

        // First list is empty - return the second
        if (a == 0)
        {
            return b;
        }

        const souffle::RamDomain *tuple = recordTable->unpack(a, 2);
        const souffle::RamDomain newTuple[2] = {
            tuple[0],
            concatCallLists(symbolTable, recordTable, tuple[1], b)};

        return recordTable->pack(newTuple, 2);
    }
}