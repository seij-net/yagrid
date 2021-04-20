#!/usr/bin/env sh

./build-fast.sh
npm version patch
npm publish
