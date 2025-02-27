#! /usr/bin/env bash

MY_DIR=$(cd $(dirname $0) && pwd)
FUNCTOR_DIR=$MY_DIR/../src/functors/

echo "Building functors..."
g++ $FUNCTOR_DIR/functors.cpp -c -fPIC -o $FUNCTOR_DIR/functors.o -I/home/dimo/.local/include
g++ -shared -o $FUNCTOR_DIR/libfunctors.so $FUNCTOR_DIR/functors.o
