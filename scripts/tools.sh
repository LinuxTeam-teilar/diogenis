#!/usr/bin/env bash
gopath=$PWD/tmp

if [ -d $gopath ]; then
    echo "Please remove $gopath"
    exit 1
fi

mkdir $gopath

GOPATH=$gopath go get github.com/tools/godep

pushd $PWD/tools > /dev/null
GOBIN=$gopath/bin $gopath/bin/godep go install dionysos.go
popd > /dev/null

