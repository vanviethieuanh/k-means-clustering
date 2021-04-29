# RUN THIS COMMAND: git checkout --orphan gh-pages

echo "🚀 Building started..."

npm run build

git --work-tree public add --all
git --work-tree public commit -m "gh-pages"

echo "🔃 Pushing to gh-pages..."

git push origin HEAD:gh-pages

echo "🚀 Successfully deployed, check your settings"