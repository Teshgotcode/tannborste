#!/bin/sh
set -e
cd "$(dirname "$0")"
npm run build
rm -rf dist/.git
cd dist
git init -q
git add -A
git commit -qm "deploy $(date +%Y-%m-%d-%H%M)"
git push -f "$(git -C .. remote get-url origin)" HEAD:gh-pages
echo "pushed to gh-pages"
