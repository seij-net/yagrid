#!/usr/bin/env sh

# Small script to cleanup working directory, reinstall dependencies, test and build

rm -rf dist
npm run test
./node_modules/.bin/tsc -d
npm run build
ls -lh dist/
