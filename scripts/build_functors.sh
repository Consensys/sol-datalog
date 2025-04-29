#! /usr/bin/env bash

MY_DIR=$(cd $(dirname $0) && pwd)
FUNCTOR_DIR=$MY_DIR/../src/functors
GEN_DIR=$MY_DIR/../src/gen/

echo "Building functors..."
g++ $FUNCTOR_DIR/functors.cpp -c -fPIC -o $FUNCTOR_DIR/functors.o -std=c++17 -I$INCLUDE_DIR -DRAM_DOMAIN_SIZE=32

if [[ $(uname) == "Linux" ]]; then
    g++  -DRAM_DOMAIN_SIZE=32 -shared -o $GEN_DIR/libfunctors.so $FUNCTOR_DIR/functors.o
fi

# if macos
if [[ $(uname) == "Darwin" ]]; then
    # build dylib
    g++ -dynamiclib -DRAM_DOMAIN_SIZE=32 -install_name $FUNCTOR_DIR/libfunctors.dylib -o $FUNCTOR_DIR/libfunctors.dylib $FUNCTOR_DIR/functors.o
    # generate a tbd file to link against
    /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/tapi stubify $FUNCTOR_DIR/libfunctors.dylib
fi

