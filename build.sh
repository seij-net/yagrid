#!/usr/bin/env sh

# Small script to cleanup working directory, reinstall dependencies, test and build

rm -rf dist
rm -rf node_modules
npm i 
./build-fast.sh