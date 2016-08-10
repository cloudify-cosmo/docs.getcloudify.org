# migrate markdown from hugo to yoda/nunjucks
find -L content -name "*.md" | xargs -l node migrate-docs.js
# rename all overview.md to index.md
find -name overview.md -execdir rename  s/overview\.md/index.md/ {} \;
