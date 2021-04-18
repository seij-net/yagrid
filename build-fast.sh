#!/usr/bin/env sh

# Small script to cleanup working directory, reinstall dependencies, test and build

rm -rf dist
npm run test
npm run build
ls -lh dist/
