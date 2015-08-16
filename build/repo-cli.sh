# Configure Git
git config --global user.email "${GIT_EMAIL}";
git config --global user.name "${GIT_NAME}";

if [ "${TRAVIS_BRANCH}" = "master" ]; then
  # Fetch repo
  git clone --quiet https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG} travis-build > /dev/null;
  cd travis-build

  # Reverse Integrate
  git checkout master > /dev/null;
  git merge --squash origin/stable --no-commit  > /dev/null;
  git commit -m "Travis CI auto-merge from travis build ${TRAVIS_BUILD_NUMBER} - [ci skip]";
  git push -q origin master > /dev/null;

  # Forward Integrate
  git checkout --track -b stable origin/stable > /dev/null;
  git merge origin/master --no-commit  > /dev/null;
  git commit -m "Travis CI auto-merge from travis build ${TRAVIS_BUILD_NUMBER}  - [ci skip]";
  npm version patch -m "Travis CI auto-version from travis build ${TRAVIS_BUILD_NUMBER}";
  git push -q origin stable > /dev/null;

  cd ..;
fi
