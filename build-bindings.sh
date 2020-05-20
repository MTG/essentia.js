#!/usr/bin/env bash
set -e -x

if [ "$#" -ne 1 ]; then
	echo "USAGE: ./build-bindings.sh <your-make-file> "
	exit
fi
make -f $1 codegen
make -f $1 build
