doctoc . --github --notitle --maxlevel 4

if [ "${TRAVIS_BRANCH}" = "master" ]; then
  # Fetch repo
  git clone --quiet https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG} docs-build > /dev/null;
  cd docs-build

  doctoc . --github
  git add -u .
  git commit -m "Travis CI auto-doc from travis build ${TRAVIS_BUILD_NUMBER} - [ci skip]";
  git push -q origin master > /dev/null;
  cd ..;
fi
