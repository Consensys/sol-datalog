#! /usr/bin/env bash

MY_DIR=$(cd $(dirname $0) && pwd)
FUNCTOR_DIR=$MY_DIR/../functors/

echo "Building functors..."
g++ $FUNCTOR_DIR/functors.cpp -c -fPIC -o $FUNCTOR_DIR/functors.o 
g++ -shared -o $FUNCTOR_DIR/libfunctors.so $FUNCTOR_DIR/functors.o
